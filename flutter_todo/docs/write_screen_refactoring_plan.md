# WriteScreen 리팩토링 계획서

> 비즈니스 로직과 UI 로직 분리를 위한 ViewModel 패턴 적용

---

## 1. 현재 코드 분석

### 현재 파일 구조
```
lib/
├── main.dart
├── models/
│   └── todo.dart
└── screens/
    ├── home_screen.dart
    ├── write_screen.dart      ← 리팩토링 대상
    └── detail_screen.dart
```

### 현재 문제점

| 문제 | 위치 | 설명 |
|------|------|------|
| 유효성 검사 로직 혼재 | line 28-30, 61-65 | UI 코드 내에 검증 로직이 포함됨 |
| Todo 생성 로직 혼재 | line 67-70 | 버튼 핸들러에서 직접 객체 생성 |
| 메모리 누수 위험 | - | `TextEditingController`의 `dispose()` 누락 |
| 테스트 어려움 | - | 비즈니스 로직이 UI에 결합되어 단위 테스트 불가 |
| 클래스명 오타 | line 11 | `_WidgetScreenState` (잘못됨) |

---

## 2. 리팩토링 후 파일 구조

```
lib/
├── main.dart
├── models/
│   └── todo.dart
├── viewmodels/                    ← 새로 추가
│   └── write_screen_viewmodel.dart
└── screens/
    ├── home_screen.dart
    ├── write_screen.dart          ← 수정
    └── detail_screen.dart
test/
├── viewmodels/                    ← 새로 추가
│   └── write_screen_viewmodel_test.dart
└── widget_test.dart
```

---

## 3. 아키텍처 다이어그램

### Before (현재)
```
┌─────────────────────────────────────────┐
│             WriteScreen                 │
│  ┌─────────────────────────────────┐   │
│  │  UI 코드 + 비즈니스 로직 혼재    │   │
│  │  - 유효성 검사                   │   │
│  │  - Todo 생성                    │   │
│  │  - 에러 상태 관리                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### After (리팩토링 후)
```
┌──────────────────┐        ┌────────────────────────┐
│   WriteScreen    │        │  WriteScreenViewModel  │
│    (UI 레이어)    │───────▶│    (비즈니스 로직)      │
├──────────────────┤        ├────────────────────────┤
│ • 화면 렌더링     │        │ • 유효성 검사          │
│ • 사용자 입력 처리 │◀───────│ • Todo 생성           │
│ • 애니메이션      │  notify │ • 상태 관리           │
└──────────────────┘        └────────────────────────┘
         │                            │
         │                            ▼
         │                    ┌───────────┐
         │                    │   Todo    │
         └───────────────────▶│  (Model)  │
               Navigator.pop  └───────────┘
```

---

## 4. 새로 생성할 파일

### 4.1 `lib/viewmodels/write_screen_viewmodel.dart`

```dart
import 'package:flutter/foundation.dart';
import '../models/todo.dart';

/// WriteScreen의 비즈니스 로직을 담당하는 ViewModel
///
/// ChangeNotifier를 상속하여 상태 변경 시 UI에 알림
class WriteScreenViewModel extends ChangeNotifier {
  // ===== 상태 필드 =====
  String _title = '';
  bool _showTitleError = false;
  bool _isSubmitting = false;

  // ===== Getters =====
  String get title => _title;
  bool get showTitleError => _showTitleError;
  bool get isSubmitting => _isSubmitting;

  /// 에러 메시지 반환 (에러 없으면 null)
  String? get titleErrorText =>
      _showTitleError && _title.isEmpty ? '할 일을 입력하세요' : null;

  /// 폼 유효성 여부
  bool get isValid => _title.trim().isNotEmpty;

  // ===== 상태 변경 메서드 =====

  /// 제목 업데이트
  ///
  /// 사용자가 입력을 시작하면 에러 메시지 자동 제거
  void setTitle(String value) {
    _title = value;
    if (value.isNotEmpty && _showTitleError) {
      _showTitleError = false;
    }
    notifyListeners();
  }

  // ===== 비즈니스 로직 =====

  /// 폼 유효성 검사
  ///
  /// Returns: 유효하면 true, 아니면 false
  bool validate() {
    if (_title.trim().isEmpty) {
      _showTitleError = true;
      notifyListeners();
      return false;
    }
    _showTitleError = false;
    notifyListeners();
    return true;
  }

  /// Todo 객체 생성
  ///
  /// 유효성 검사 실패 시 null 반환
  Todo? createTodo() {
    if (!validate()) {
      return null;
    }

    _isSubmitting = true;
    notifyListeners();

    final todo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: _title.trim(),
    );

    _isSubmitting = false;
    notifyListeners();

    return todo;
  }

  /// 폼 초기화
  void reset() {
    _title = '';
    _showTitleError = false;
    _isSubmitting = false;
    notifyListeners();
  }
}
```

---

## 5. 수정할 파일

### 5.1 `lib/screens/write_screen.dart`

#### Before (현재 코드)
```dart
import 'package:flutter/material.dart';
import '../models/todo.dart';

class WriteScreen extends StatefulWidget {
  const WriteScreen({super.key});

  @override
  State<StatefulWidget> createState() => _WidgetScreenState();
}

class _WidgetScreenState extends State<WriteScreen> {
  final TextEditingController _titleController = TextEditingController();
  bool _showErrorTitle = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('새 할 일 추가')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: '할 일',
                border: OutlineInputBorder(),
                errorText: _showErrorTitle && _titleController.text.isEmpty
                    ? '할 일을 입력하세요'
                    : null,
              ),
              onChanged: (value) {
                if (value.isNotEmpty && _showErrorTitle) {
                  setState(() {
                    _showErrorTitle = false;
                  });
                }
              },
            ),
            SizedBox(height: 20),
            Container(
              height: 200,
              width: double.infinity,
              color: Colors.grey[300],
              child: Icon(Icons.camera_alt, size: 50, color: Colors.grey[600]),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // TODO: 카메라 호출 로직
              },
              child: Text('사진 촬영하기'),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ElevatedButton(
          onPressed: () {
            if (_titleController.text.isEmpty) {
              setState(() {
                _showErrorTitle = true;
              });
              return;
            } else {
              final newTodo = Todo(
                id: DateTime.now().toString(),
                title: _titleController.text,
              );
              setState(() {
                _showErrorTitle = false;
              });
              Navigator.pop(context, newTodo);
            }
          },
          child: const Text('저장하기'),
        ),
      ),
    );
  }
}
```

#### After (리팩토링 후 코드)
```dart
import 'package:flutter/material.dart';
import '../models/todo.dart';
import '../viewmodels/write_screen_viewmodel.dart';

class WriteScreen extends StatefulWidget {
  const WriteScreen({super.key});

  @override
  State<WriteScreen> createState() => _WriteScreenState();
}

class _WriteScreenState extends State<WriteScreen> {
  // UI 컨트롤러 (Screen에 유지)
  final TextEditingController _titleController = TextEditingController();

  // ViewModel 인스턴스
  late final WriteScreenViewModel _viewModel;

  @override
  void initState() {
    super.initState();
    _viewModel = WriteScreenViewModel();
    _viewModel.addListener(_onViewModelChanged);
  }

  @override
  void dispose() {
    // 메모리 누수 방지를 위한 정리
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    _titleController.dispose();
    super.dispose();
  }

  /// ViewModel 상태 변경 시 UI 갱신
  void _onViewModelChanged() {
    setState(() {});
  }

  /// 제목 입력 처리
  void _onTitleChanged(String value) {
    _viewModel.setTitle(value);
  }

  /// 저장 버튼 처리
  void _onSavePressed() {
    final newTodo = _viewModel.createTodo();
    if (newTodo != null) {
      Navigator.pop(context, newTodo);
    }
  }

  /// 카메라 버튼 처리
  void _onCameraPressed() {
    // TODO: 카메라 호출 로직
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('새 할 일 추가')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // 제목 입력 필드
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: '할 일',
                border: const OutlineInputBorder(),
                errorText: _viewModel.titleErrorText,  // ViewModel에서 가져옴
              ),
              onChanged: _onTitleChanged,
            ),
            const SizedBox(height: 20),
            // 이미지 영역
            Container(
              height: 200,
              width: double.infinity,
              color: Colors.grey[300],
              child: Icon(Icons.camera_alt, size: 50, color: Colors.grey[600]),
            ),
            const SizedBox(height: 20),
            // 카메라 버튼
            ElevatedButton(
              onPressed: _onCameraPressed,
              child: const Text('사진 촬영하기'),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ElevatedButton(
          onPressed: _viewModel.isSubmitting ? null : _onSavePressed,
          child: _viewModel.isSubmitting
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('저장하기'),
        ),
      ),
    );
  }
}
```

---

## 6. 주요 변경 사항 비교

| 항목 | Before | After |
|------|--------|-------|
| **상태 관리** | `_showErrorTitle` 직접 관리 | `_viewModel.titleErrorText` 사용 |
| **유효성 검사** | `onPressed` 내부에서 직접 | `_viewModel.validate()` |
| **Todo 생성** | 버튼 핸들러에서 직접 생성 | `_viewModel.createTodo()` |
| **메모리 관리** | `dispose()` 없음 | 모든 리소스 정리 |
| **클래스명** | `_WidgetScreenState` (오타) | `_WriteScreenState` |
| **테스트 가능성** | UI 없이 테스트 불가 | ViewModel 단위 테스트 가능 |

---

## 7. 단위 테스트 코드

### `test/viewmodels/write_screen_viewmodel_test.dart`

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_todo/viewmodels/write_screen_viewmodel.dart';

void main() {
  group('WriteScreenViewModel', () {
    late WriteScreenViewModel viewModel;

    setUp(() {
      viewModel = WriteScreenViewModel();
    });

    tearDown(() {
      viewModel.dispose();
    });

    group('초기 상태', () {
      test('제목이 비어있어야 함', () {
        expect(viewModel.title, '');
      });

      test('에러가 표시되지 않아야 함', () {
        expect(viewModel.showTitleError, false);
        expect(viewModel.titleErrorText, null);
      });

      test('유효하지 않은 상태여야 함', () {
        expect(viewModel.isValid, false);
      });
    });

    group('setTitle', () {
      test('제목 값이 업데이트되어야 함', () {
        viewModel.setTitle('장보기');
        expect(viewModel.title, '장보기');
      });

      test('제목 입력 시 에러가 사라져야 함', () {
        // 먼저 에러 발생시킴
        viewModel.validate();
        expect(viewModel.showTitleError, true);

        // 제목 입력
        viewModel.setTitle('새 할 일');
        expect(viewModel.showTitleError, false);
      });

      test('리스너에게 알림이 가야 함', () {
        var notified = false;
        viewModel.addListener(() => notified = true);

        viewModel.setTitle('테스트');
        expect(notified, true);
      });
    });

    group('validate', () {
      test('빈 제목은 false 반환 및 에러 표시', () {
        final result = viewModel.validate();

        expect(result, false);
        expect(viewModel.showTitleError, true);
        expect(viewModel.titleErrorText, '할 일을 입력하세요');
      });

      test('공백만 있는 제목은 false 반환', () {
        viewModel.setTitle('   ');
        final result = viewModel.validate();

        expect(result, false);
        expect(viewModel.showTitleError, true);
      });

      test('유효한 제목은 true 반환', () {
        viewModel.setTitle('유효한 할 일');
        final result = viewModel.validate();

        expect(result, true);
        expect(viewModel.showTitleError, false);
      });
    });

    group('createTodo', () {
      test('유효성 검사 실패 시 null 반환', () {
        final todo = viewModel.createTodo();
        expect(todo, null);
      });

      test('유효한 데이터로 Todo 생성', () {
        viewModel.setTitle('테스트 할 일');

        final todo = viewModel.createTodo();

        expect(todo, isNotNull);
        expect(todo!.title, '테스트 할 일');
        expect(todo.isDone, false);
        expect(todo.id, isNotEmpty);
      });

      test('제목 앞뒤 공백 제거', () {
        viewModel.setTitle('  공백 포함  ');

        final todo = viewModel.createTodo();

        expect(todo!.title, '공백 포함');
      });
    });

    group('reset', () {
      test('모든 상태가 초기화되어야 함', () {
        viewModel.setTitle('어떤 제목');
        viewModel.validate();

        viewModel.reset();

        expect(viewModel.title, '');
        expect(viewModel.showTitleError, false);
        expect(viewModel.isSubmitting, false);
      });
    });
  });
}
```

---

## 8. 검증 방법

### 테스트 실행
```bash
# ViewModel 단위 테스트
flutter test test/viewmodels/write_screen_viewmodel_test.dart

# 전체 테스트
flutter test
```

### 수동 테스트 시나리오
1. 앱 실행
2. FAB(+) 버튼 클릭하여 새 할 일 추가 화면 진입
3. 빈 상태에서 "저장하기" 클릭 → "할 일을 입력하세요" 에러 표시 확인
4. 제목 입력 → 에러 메시지 사라짐 확인
5. "저장하기" 클릭 → 홈 화면으로 복귀 및 새 항목 추가 확인

---

## 9. 학습 포인트

### ChangeNotifier 패턴
- Flutter에 내장된 Observer 패턴 구현체
- `addListener()` / `removeListener()`로 구독 관리
- `notifyListeners()` 호출 시 모든 리스너에게 알림
- Provider 없이도 반응형 UI 구현 가능

### 관심사 분리의 이점
| 이점 | 설명 |
|------|------|
| **테스트 용이성** | ViewModel은 순수 Dart 클래스라 Flutter 의존성 없이 테스트 |
| **재사용성** | 같은 ViewModel을 다른 UI에서 재사용 가능 |
| **유지보수성** | UI 변경이 로직에 영향 주지 않음 |
| **협업 효율** | UI 개발자와 로직 개발자 병렬 작업 가능 |

### TextEditingController를 Screen에 유지하는 이유
- 커서 위치, 텍스트 선택 영역 등 **UI 관심사**
- ViewModel은 문자열 값만 관리
- 테스트 시 Controller 모킹 불필요