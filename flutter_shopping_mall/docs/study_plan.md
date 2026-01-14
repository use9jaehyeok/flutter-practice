# Flutter 학습용 WebView 기반 쇼핑몰 앱 프로젝트 계획서

## 📋 프로젝트 개요

### 목적
Flutter 초보자가 실전 경험을 쌓기 위한 **WebView 하이브리드** 학습용 쇼핑몰 앱 개발

### 앱 이름 (가칭)
**ShopLearn** - Flutter WebView 쇼핑몰 학습 프로젝트

### 학습 목표
- **WebView 통합 및 JavaScript 브릿지 통신** (핵심)
- flutter_inappwebview 패키지 숙달
- JavaScript ↔ Dart 양방향 통신
- 네이티브 기능 연동 (이미지 선택, 로컬 저장소)
- 하이브리드 앱 아키텍처 이해
- 실무적인 WebView 앱 구조 학습

### 아키텍처 특징
- **웹 우선 아키텍처**: 모든 UI는 웹(HTML/CSS/JS)으로 구현
- **네이티브 브릿지**: 카메라, 저장소, 알림 등 네이티브 기능만 Flutter에서 처리
- **실전 패턴**: 반말티켓 앱과 동일한 구조로 실무 경험 습득

---

## 🎯 요구사항 명세서

### 1. 기능 요구사항 (WebView 기반)

#### 1.1 웹 앱 부분 (HTML/CSS/JavaScript)
모든 UI와 비즈니스 로직은 **웹에서 구현**됩니다.

**구현할 웹 페이지:**
- `index.html` - 상품 목록 화면
- `product-detail.html` - 상품 상세 화면
- `favorites.html` - 좋아요 목록
- `cart.html` - 장바구니 화면

**웹 기능:**
- FakeStore API 호출 및 상품 목록 렌더링
- 상품 카드 클릭 시 상세 페이지 이동
- 좋아요 버튼 클릭 → Flutter로 데이터 전송
- 장바구니 추가 → Flutter로 데이터 전송
- 프로필 이미지 변경 버튼 → Flutter 카메라 호출

#### 1.2 Flutter 네이티브 부분
**핵심 역할: JavaScript 브릿지 제공**

**필수 JavaScript 핸들러:**
1. `saveFavorite` - 좋아요 상품 ID를 SharedPreferences에 저장
2. `getFavorites` - 저장된 좋아요 목록을 웹으로 반환
3. `saveCart` - 장바구니 데이터 저장
4. `getCart` - 장바구니 데이터 조회
5. `pickImage` - 이미지 선택 및 Base64 반환
6. `showToast` - 네이티브 토스트 메시지 표시

**네이티브 기능:**
- 이미지 선택 (image_picker)
- 이미지 크롭 (image_cropper)
- 로컬 데이터 저장 (shared_preferences)
- 뒤로가기 버튼 처리 (더블탭 종료)
- WebView 히스토리 관리

#### 1.3 JavaScript ↔ Dart 통신 흐름

**예시: 좋아요 버튼 클릭**
```
[웹] 사용자가 하트 버튼 클릭
  ↓
[웹 JS] window.flutter_inappwebview.callHandler('saveFavorite', {productId: 1})
  ↓
[Flutter] handlerSaveFavorite 실행 → SharedPreferences에 저장
  ↓
[Flutter] return {status: 'ok', favorites: [1, 2, 3]}
  ↓
[웹 JS] .then() 응답 받아 UI 업데이트 (하트 색상 변경)
```

### 2. 비기능 요구사항

#### 2.1 성능
- WebView 초기 로딩 최적화
- 로컬 HTML 파일 사용 (assets 폴더)
- 이미지 lazy loading (웹에서 처리)

#### 2.2 사용성
- WebView 터치 제스처 자연스러움
- 네이티브와 웹 간 seamless한 UX
- 로딩 인디케이터 (웹/네이티브 모두)

#### 2.3 코드 품질
- JavaScript 핸들러 명확한 네이밍
- 웹과 네이티브 역할 명확히 분리
- 에러 핸들링 (통신 실패 시)

---

## 🏗️ 기술 스택

### Flutter 네이티브
- **Flutter SDK**: 3.2.0 이상
- **Dart**: 3.2.0 이상

### WebView 핵심 패키지
- **flutter_inappwebview**: ^6.0.0 - WebView 및 JavaScript 브릿지 (주요)
- **webview_flutter**: ^4.0.0 - 대안/비교 학습용 (선택)

### 네이티브 기능
- **image_picker**: ^1.0.0 - 갤러리/카메라 이미지 선택
- **image_cropper**: ^5.0.0 - 이미지 크롭 기능
- **permission_handler**: ^11.0.0 - 권한 요청 (카메라, 저장소)
- **shared_preferences**: ^2.2.0 - 로컬 데이터 저장 (좋아요, 장바구니)
- **fluttertoast**: ^8.2.0 - 토스트 메시지

### 웹 앱 부분 (HTML/CSS/JavaScript)
- **Vanilla JavaScript** - 브릿지 통신, API 호출
- **FakeStore API**: https://fakestoreapi.com/ - 상품 데이터
- **Tailwind CSS** 또는 **Bootstrap** - 빠른 스타일링 (선택)

### 상태관리
- **없음** - WebView 기반이므로 상태는 웹에서 관리
- JavaScript localStorage/sessionStorage 사용

---

## 📁 프로젝트 구조

```
shop_learn/
├── lib/                          # Flutter 네이티브 코드
│   ├── main.dart                 # 앱 진입점
│   ├── webview_screen.dart       # WebView 컴포넌트 (핵심, 300줄)
│   │
│   ├── services/                 # 네이티브 서비스
│   │   ├── storage_service.dart  # SharedPreferences 래퍼 (100줄)
│   │   └── image_service.dart    # 이미지 선택/크롭 (150줄)
│   │
│   └── constants/                # 상수
│       └── app_constants.dart    # URL, 설정 값
│
├── assets/                       # 리소스
│   └── web/                      # 웹 앱 파일 (중요!)
│       ├── index.html            # 상품 목록 화면 (200줄)
│       ├── product-detail.html   # 상품 상세 (150줄)
│       ├── favorites.html        # 좋아요 목록 (100줄)
│       ├── cart.html             # 장바구니 (150줄)
│       │
│       ├── css/
│       │   └── style.css         # 공통 스타일 (100줄)
│       │
│       └── js/
│           ├── app.js            # 공통 로직 (50줄)
│           ├── api.js            # FakeStore API (80줄)
│           └── bridge.js         # Flutter 브릿지 헬퍼 (100줄)
│
├── android/                      # Android 설정
├── ios/                          # iOS 설정
└── pubspec.yaml                  # 의존성 설정
```

---

## 🚀 개발 단계별 가이드 (총 8일)

### Phase 1: 프로젝트 초기 설정 및 기본 WebView (1일)

#### 목표
WebView 기반 프로젝트 구조 설정 및 첫 HTML 로드

#### 작업 내용
1. **새 Flutter 프로젝트 생성**
   ```bash
   flutter create shop_learn
   cd shop_learn
   ```

2. **pubspec.yaml 의존성 추가**
   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     flutter_inappwebview: ^6.0.0
     shared_preferences: ^2.2.0
     image_picker: ^1.0.4
     image_cropper: ^5.0.1
     permission_handler: ^11.2.1
     fluttertoast: ^8.2.12

   flutter:
     assets:
       - assets/web/
       - assets/web/js/
       - assets/web/css/
   ```

3. **폴더 구조 생성**
   ```bash
   mkdir -p lib/services lib/constants
   mkdir -p assets/web/js assets/web/css
   ```

4. **간단한 HTML 테스트 파일** (`assets/web/index.html`)
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>ShopLearn</title>
     <style>
       body { font-family: Arial; padding: 20px; background: #f5f5f5; }
       h1 { color: #333; }
       button {
         padding: 12px 24px;
         font-size: 16px;
         background: #007AFF;
         color: white;
         border: none;
         border-radius: 8px;
         cursor: pointer;
       }
     </style>
   </head>
   <body>
     <h1>🛒 ShopLearn WebView</h1>
     <p>Flutter와 웹이 연결되었습니다!</p>
     <button onclick="testButton()">버튼 테스트</button>

     <script>
       function testButton() {
         console.log('버튼 클릭됨!');
         alert('WebView 테스트 성공!');
       }
     </script>
   </body>
   </html>
   ```

5. **기본 WebView 화면** (`lib/webview_screen.dart`)
   ```dart
   import 'package:flutter/material.dart';
   import 'package:flutter_inappwebview/flutter_inappwebview.dart';
   import 'dart:io';

   class WebViewScreen extends StatefulWidget {
     const WebViewScreen({Key? key}) : super(key: key);

     @override
     State<WebViewScreen> createState() => _WebViewScreenState();
   }

   class _WebViewScreenState extends State<WebViewScreen> {
     InAppWebViewController? webViewController;
     int backButtonTime = 0;

     @override
     Widget build(BuildContext context) {
       return PopScope(
         canPop: false,
         onPopInvoked: (didPop) async {
           if (didPop) return;

           // 뒤로가기 처리
           if (webViewController != null &&
               await webViewController!.canGoBack()) {
             webViewController!.goBack();
           } else {
             // 더블탭 종료
             int now = DateTime.now().millisecondsSinceEpoch;
             if (now - backButtonTime < 2000) {
               exit(0);
             } else {
               ScaffoldMessenger.of(context).showSnackBar(
                 const SnackBar(content: Text('뒤로 버튼을 한 번 더 누르면 종료됩니다'))
               );
               backButtonTime = now;
             }
           }
         },
         child: Scaffold(
           body: SafeArea(
             child: InAppWebView(
               initialUrlRequest: URLRequest(
                 url: WebUri('file:///android_asset/flutter_assets/assets/web/index.html'),
               ),
               initialSettings: InAppWebViewSettings(
                 javaScriptEnabled: true,
                 allowFileAccess: true,
                 domStorageEnabled: true,
               ),
               onWebViewCreated: (controller) {
                 webViewController = controller;
                 print('✅ WebView 생성 완료');
               },
               onLoadStop: (controller, url) {
                 print('✅ 페이지 로드 완료: $url');
               },
               onConsoleMessage: (controller, message) {
                 print('📱 JS 콘솔: ${message.message}');
               },
             ),
           ),
         ),
       );
     }
   }
   ```

6. **main.dart 수정**
   ```dart
   import 'package:flutter/material.dart';
   import 'webview_screen.dart';

   void main() {
     runApp(const MyApp());
   }

   class MyApp extends StatelessWidget {
     const MyApp({Key? key}) : super(key: key);

     @override
     Widget build(BuildContext context) {
       return MaterialApp(
         title: 'ShopLearn',
         theme: ThemeData(primarySwatch: Colors.blue),
         home: const WebViewScreen(),
       );
     }
   }
   ```

#### 학습 포인트
- ✅ flutter_inappwebview 패키지 설치 및 사용
- ✅ assets 폴더 구조 및 pubspec.yaml 등록
- ✅ WebView 초기 설정 (JavaScript, 파일 접근 권한)
- ✅ 더블탭 뒤로가기 종료 패턴
- ✅ 콘솔 메시지 확인으로 디버깅

---

### Phase 2: JavaScript 브릿지 구축 (1-2일)

#### 목표
Flutter ↔ JavaScript 양방향 통신 구현

#### 작업 내용
1. **브릿지 헬퍼 JavaScript** (`assets/web/js/bridge.js`)
   ```javascript
   // Flutter 브릿지 헬퍼 함수
   const FlutterBridge = {
     // 토스트 메시지 표시
     showToast: async function(message) {
       try {
         const result = await window.flutter_inappwebview.callHandler('showToast', message);
         console.log('토스트 결과:', result);
         return result;
       } catch (error) {
         console.error('토스트 에러:', error);
         alert(message); // 폴백
       }
     },

     // 좋아요 저장
     saveFavorite: async function(productId) {
       try {
         const result = await window.flutter_inappwebview.callHandler('saveFavorite', productId);
         console.log('좋아요 저장:', result);
         return result;
       } catch (error) {
         console.error('좋아요 저장 실패:', error);
         return {status: 'error', message: error.toString()};
       }
     },

     // 좋아요 목록 가져오기
     getFavorites: async function() {
       try {
         const result = await window.flutter_inappwebview.callHandler('getFavorites');
         return result.favorites || [];
       } catch (error) {
         console.error('좋아요 조회 실패:', error);
         return [];
       }
     }
   };
   ```

2. **Flutter 핸들러 등록** (`lib/webview_screen.dart`에 추가)
   ```dart
   onWebViewCreated: (controller) {
     webViewController = controller;

     // 1️⃣ 토스트 메시지 핸들러
     controller.addJavaScriptHandler(
       handlerName: 'showToast',
       callback: (args) {
         if (args.isNotEmpty) {
           String message = args[0];
           Fluttertoast.showToast(
             msg: message,
             toastLength: Toast.LENGTH_SHORT,
             gravity: ToastGravity.BOTTOM,
           );
           return {'status': 'ok'};
         }
         return {'status': 'error', 'message': 'No message provided'};
       },
     );

     // 2️⃣ 좋아요 저장 핸들러
     controller.addJavaScriptHandler(
       handlerName: 'saveFavorite',
       callback: (args) async {
         if (args.isNotEmpty) {
           int productId = args[0];
           // SharedPreferences에 저장
           final prefs = await SharedPreferences.getInstance();
           List<String> favorites = prefs.getStringList('favorites') ?? [];

           if (favorites.contains(productId.toString())) {
             favorites.remove(productId.toString());
           } else {
             favorites.add(productId.toString());
           }

           await prefs.setStringList('favorites', favorites);

           return {
             'status': 'ok',
             'favorites': favorites.map((e) => int.parse(e)).toList(),
           };
         }
         return {'status': 'error'};
       },
     );

     // 3️⃣ 좋아요 조회 핸들러
     controller.addJavaScriptHandler(
       handlerName: 'getFavorites',
       callback: (args) async {
         final prefs = await SharedPreferences.getInstance();
         List<String> favorites = prefs.getStringList('favorites') ?? [];

         return {
           'favorites': favorites.map((e) => int.parse(e)).toList(),
         };
       },
     );
   }
   ```

3. **HTML에서 브릿지 테스트** (`assets/web/index.html` 업데이트)
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>ShopLearn</title>
     <link rel="stylesheet" href="css/style.css">
   </head>
   <body>
     <h1>🛒 ShopLearn</h1>

     <div class="card">
       <h2>JavaScript 브릿지 테스트</h2>
       <button onclick="testToast()">토스트 테스트</button>
       <button onclick="testFavorite()">좋아요 저장 테스트</button>
       <button onclick="loadFavorites()">좋아요 조회 테스트</button>
     </div>

     <div id="result"></div>

     <script src="js/bridge.js"></script>
     <script>
       async function testToast() {
         await FlutterBridge.showToast('안녕하세요! Flutter 토스트입니다!');
       }

       async function testFavorite() {
         const result = await FlutterBridge.saveFavorite(123);
         document.getElementById('result').innerHTML =
           `좋아요 결과: ${JSON.stringify(result)}`;
       }

       async function loadFavorites() {
         const favorites = await FlutterBridge.getFavorites();
         document.getElementById('result').innerHTML =
           `좋아요 목록: ${favorites.join(', ')}`;
       }
     </script>
   </body>
   </html>
   ```

#### 학습 포인트
- ✅ addJavaScriptHandler 사용법
- ✅ async/await 비동기 통신
- ✅ SharedPreferences 데이터 저장/조회
- ✅ Fluttertoast 패키지 사용
- ✅ JavaScript에서 Flutter 함수 호출
- ✅ 에러 핸들링 (try-catch)

---

### Phase 3: 상품 목록 웹 페이지 구현 (2일)

#### 목표
FakeStore API를 호출하여 상품 목록을 웹에서 렌더링

#### 작업 내용
1. **API 헬퍼 JavaScript** (`assets/web/js/api.js`)
   ```javascript
   const API = {
     BASE_URL: 'https://fakestoreapi.com',

     // 모든 상품 가져오기
     fetchProducts: async function() {
       try {
         const response = await fetch(`${this.BASE_URL}/products`);
         const products = await response.json();
         return products;
       } catch (error) {
         console.error('상품 조회 실패:', error);
         return [];
       }
     },

     // 상품 상세 가져오기
     fetchProduct: async function(id) {
       try {
         const response = await fetch(`${this.BASE_URL}/products/${id}`);
         return await response.json();
       } catch (error) {
         console.error('상품 상세 조회 실패:', error);
         return null;
       }
     }
   };
   ```

2. **상품 목록 HTML** (`assets/web/index.html` 완성)
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>ShopLearn - 상품 목록</title>
     <link rel="stylesheet" href="css/style.css">
   </head>
   <body>
     <header>
       <h1>🛒 ShopLearn</h1>
       <nav>
         <a href="index.html" class="active">홈</a>
         <a href="favorites.html">좋아요</a>
         <a href="cart.html">장바구니</a>
       </nav>
     </header>

     <main>
       <div id="loading">로딩 중...</div>
       <div id="products" class="product-grid"></div>
     </main>

     <script src="js/bridge.js"></script>
     <script src="js/api.js"></script>
     <script src="js/app.js"></script>
     <script>
       let favorites = [];

       async function init() {
         // 좋아요 목록 로드
         favorites = await FlutterBridge.getFavorites();

         // 상품 목록 로드
         const products = await API.fetchProducts();
         renderProducts(products);
       }

       function renderProducts(products) {
         const container = document.getElementById('products');
         const loading = document.getElementById('loading');
         loading.style.display = 'none';

         container.innerHTML = products.map(product => `
           <div class="product-card">
             <img src="${product.image}" alt="${product.title}">
             <div class="product-info">
               <h3>${product.title}</h3>
               <p class="price">$${product.price}</p>
               <div class="actions">
                 <button
                   class="favorite-btn ${favorites.includes(product.id) ? 'active' : ''}"
                   onclick="toggleFavorite(${product.id})"
                 >
                   ❤️
                 </button>
                 <button onclick="viewProduct(${product.id})">
                   상세보기
                 </button>
               </div>
             </div>
           </div>
         `).join('');
       }

       async function toggleFavorite(productId) {
         const result = await FlutterBridge.saveFavorite(productId);
         if (result.status === 'ok') {
           favorites = result.favorites;
           // 버튼 상태 업데이트
           const btn = event.target;
           btn.classList.toggle('active');
         }
       }

       function viewProduct(productId) {
         window.location.href = `product-detail.html?id=${productId}`;
       }

       // 페이지 로드 시 초기화
       init();
     </script>
   </body>
   </html>
   ```

3. **스타일시트** (`assets/web/css/style.css`)
   ```css
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   body {
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
     background: #f5f5f5;
   }

   header {
     background: white;
     padding: 16px;
     box-shadow: 0 2px 4px rgba(0,0,0,0.1);
   }

   header h1 {
     font-size: 24px;
     margin-bottom: 12px;
   }

   nav {
     display: flex;
     gap: 16px;
   }

   nav a {
     color: #666;
     text-decoration: none;
     padding: 8px 16px;
     border-radius: 8px;
   }

   nav a.active {
     background: #007AFF;
     color: white;
   }

   main {
     padding: 16px;
   }

   .product-grid {
     display: grid;
     grid-template-columns: repeat(2, 1fr);
     gap: 16px;
   }

   .product-card {
     background: white;
     border-radius: 12px;
     overflow: hidden;
     box-shadow: 0 2px 8px rgba(0,0,0,0.1);
   }

   .product-card img {
     width: 100%;
     height: 150px;
     object-fit: cover;
   }

   .product-info {
     padding: 12px;
   }

   .product-info h3 {
     font-size: 14px;
     margin-bottom: 8px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
   }

   .price {
     font-size: 18px;
     font-weight: bold;
     color: #007AFF;
     margin-bottom: 12px;
   }

   .actions {
     display: flex;
     gap: 8px;
   }

   button {
     flex: 1;
     padding: 10px;
     border: none;
     border-radius: 8px;
     background: #007AFF;
     color: white;
     cursor: pointer;
     font-size: 14px;
   }

   .favorite-btn {
     flex: 0 0 40px;
     background: #f0f0f0;
   }

   .favorite-btn.active {
     background: #ff4444;
   }

   #loading {
     text-align: center;
     padding: 40px;
     font-size: 18px;
     color: #666;
   }
   ```

#### 학습 포인트
- ✅ Fetch API를 사용한 HTTP 요청
- ✅ JSON 데이터 파싱 및 렌더링
- ✅ CSS Grid 레이아웃
- ✅ 동적 HTML 생성 (template literals)
- ✅ 이벤트 핸들링 (onclick)
- ✅ 웹과 네이티브 데이터 동기화

---

### Phase 4: 상품 상세 페이지 및 장바구니 (2일)

#### 목표
상품 상세 화면과 장바구니 기능 구현

#### 작업 내용
1. **장바구니 저장 핸들러 추가** (`lib/webview_screen.dart`)
   ```dart
   controller.addJavaScriptHandler(
     handlerName: 'saveCart',
     callback: (args) async {
       if (args.isNotEmpty) {
         String cartJson = args[0];
         final prefs = await SharedPreferences.getInstance();
         await prefs.setString('cart', cartJson);
         return {'status': 'ok'};
       }
       return {'status': 'error'};
     },
   );

   controller.addJavaScriptHandler(
     handlerName: 'getCart',
     callback: (args) async {
       final prefs = await SharedPreferences.getInstance();
       String cartJson = prefs.getString('cart') ?? '[]';
       return {'cart': cartJson};
     },
   );
   ```

2. **상품 상세 페이지** (`assets/web/product-detail.html`)
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>상품 상세</title>
     <link rel="stylesheet" href="css/style.css">
   </head>
   <body>
     <header>
       <button onclick="history.back()">← 뒤로</button>
       <h1>상품 상세</h1>
     </header>

     <main id="detail">
       <div id="loading">로딩 중...</div>
     </main>

     <script src="js/bridge.js"></script>
     <script src="js/api.js"></script>
     <script>
       async function init() {
         const urlParams = new URLSearchParams(window.location.search);
         const productId = urlParams.get('id');

         const product = await API.fetchProduct(productId);
         renderProduct(product);
       }

       function renderProduct(product) {
         document.getElementById('loading').style.display = 'none';
         document.getElementById('detail').innerHTML = `
           <img src="${product.image}" alt="${product.title}" class="detail-image">
           <div class="detail-content">
             <h2>${product.title}</h2>
             <p class="price">$${product.price}</p>
             <p class="description">${product.description}</p>
             <div class="category">카테고리: ${product.category}</div>
             <div class="rating">⭐ ${product.rating.rate} (${product.rating.count}개 리뷰)</div>

             <div class="button-group">
               <button onclick="addToCart(${product.id})">장바구니 담기</button>
             </div>
           </div>
         `;
       }

       async function addToCart(productId) {
         const product = await API.fetchProduct(productId);

         // 기존 장바구니 불러오기
         const result = await window.flutter_inappwebview.callHandler('getCart');
         let cart = JSON.parse(result.cart);

         // 상품 추가
         const existingItem = cart.find(item => item.id === productId);
         if (existingItem) {
           existingItem.quantity += 1;
         } else {
           cart.push({...product, quantity: 1});
         }

         // 저장
         await window.flutter_inappwebview.callHandler('saveCart', JSON.stringify(cart));
         await FlutterBridge.showToast('장바구니에 추가되었습니다!');
       }

       init();
     </script>
   </body>
   </html>
   ```

#### 학습 포인트
- ✅ URL 파라미터 파싱 (URLSearchParams)
- ✅ JSON 직렬화/역직렬화
- ✅ 장바구니 로직 (추가, 수량 증가)
- ✅ 네이티브 저장소 활용

---

### Phase 5: 이미지 선택 기능 (1-2일)

#### 목표
Flutter 이미지 피커와 크롭 기능을 웹에서 호출

#### 작업 내용
1. **이미지 서비스** (`lib/services/image_service.dart`)
   ```dart
   import 'dart:convert';
   import 'dart:typed_data';
   import 'package:image_picker/image_picker.dart';
   import 'package:image_cropper/image_cropper.dart';

   class ImageService {
     final ImagePicker _picker = ImagePicker();

     Future<Map<String, dynamic>> pickAndCropImage() async {
       try {
         // 1. 이미지 선택
         final XFile? image = await _picker.pickImage(
           source: ImageSource.gallery,
           maxWidth: 1800,
           maxHeight: 1800,
         );

         if (image == null) {
           return {'status': 'cancelled'};
         }

         // 2. 이미지 크롭
         final CroppedFile? croppedFile = await ImageCropper().cropImage(
           sourcePath: image.path,
           aspectRatioPresets: [
             CropAspectRatioPreset.square,
             CropAspectRatioPreset.ratio4x3,
           ],
           uiSettings: [
             AndroidUiSettings(
               toolbarTitle: '이미지 자르기',
               initAspectRatio: CropAspectRatioPreset.square,
             ),
             IOSUiSettings(
               title: '이미지 자르기',
             ),
           ],
         );

         if (croppedFile == null) {
           return {'status': 'cancelled'};
         }

         // 3. Base64 인코딩
         final Uint8List bytes = await croppedFile.readAsBytes();
         final String base64Image = base64Encode(bytes);

         return {
           'status': 'ok',
           'imageBase64': base64Image,
         };
       } catch (e) {
         return {'status': 'error', 'message': e.toString()};
       }
     }
   }
   ```

2. **핸들러 등록** (`lib/webview_screen.dart`)
   ```dart
   controller.addJavaScriptHandler(
     handlerName: 'pickImage',
     callback: (args) async {
       final imageService = ImageService();
       final result = await imageService.pickAndCropImage();
       return result;
     },
   );
   ```

3. **웹에서 이미지 선택** (추가 기능)
   ```html
   <button onclick="selectProfileImage()">프로필 이미지 변경</button>
   <img id="profile" src="default-avatar.png" alt="프로필">

   <script>
     async function selectProfileImage() {
       const result = await window.flutter_inappwebview.callHandler('pickImage');

       if (result.status === 'ok') {
         const imgElement = document.getElementById('profile');
         imgElement.src = 'data:image/jpeg;base64,' + result.imageBase64;
         await FlutterBridge.showToast('이미지가 변경되었습니다!');
       }
     }
   </script>
   ```

#### 학습 포인트
- ✅ ImagePicker 사용법
- ✅ ImageCropper 통합
- ✅ Base64 인코딩
- ✅ 바이너리 데이터를 웹으로 전송
- ✅ Data URL 형식으로 이미지 표시

---

### Phase 6: 좋아요 및 장바구니 페이지 완성 (1일)

#### 목표
좋아요 목록과 장바구니 페이지 구현

#### 작업 내용
1. **좋아요 페이지** (`assets/web/favorites.html`)
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>좋아요 목록</title>
     <link rel="stylesheet" href="css/style.css">
   </head>
   <body>
     <header>
       <h1>❤️ 좋아요 목록</h1>
       <nav>
         <a href="index.html">홈</a>
         <a href="favorites.html" class="active">좋아요</a>
         <a href="cart.html">장바구니</a>
       </nav>
     </header>

     <main>
       <div id="favorites"></div>
       <div id="empty" style="display: none; text-align: center; padding: 40px;">
         <p>좋아요한 상품이 없습니다.</p>
         <a href="index.html">쇼핑하러 가기</a>
       </div>
     </main>

     <script src="js/bridge.js"></script>
     <script src="js/api.js"></script>
     <script>
       async function loadFavorites() {
         const favoriteIds = await FlutterBridge.getFavorites();

         if (favoriteIds.length === 0) {
           document.getElementById('empty').style.display = 'block';
           return;
         }

         const products = await Promise.all(
           favoriteIds.map(id => API.fetchProduct(id))
         );

         renderFavorites(products);
       }

       function renderFavorites(products) {
         const container = document.getElementById('favorites');
         container.innerHTML = products.map(product => `
           <div class="favorite-item">
             <img src="${product.image}" alt="${product.title}">
             <div class="info">
               <h3>${product.title}</h3>
               <p class="price">$${product.price}</p>
             </div>
             <button onclick="removeFavorite(${product.id})">삭제</button>
           </div>
         `).join('');
       }

       async function removeFavorite(productId) {
         await FlutterBridge.saveFavorite(productId);
         loadFavorites(); // 새로고침
       }

       loadFavorites();
     </script>
   </body>
   </html>
   ```

2. **장바구니 페이지** (`assets/web/cart.html`)
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>장바구니</title>
     <link rel="stylesheet" href="css/style.css">
   </head>
   <body>
     <header>
       <h1>🛒 장바구니</h1>
       <nav>
         <a href="index.html">홈</a>
         <a href="favorites.html">좋아요</a>
         <a href="cart.html" class="active">장바구니</a>
       </nav>
     </header>

     <main>
       <div id="cart-items"></div>
       <div id="total"></div>
       <button onclick="checkout()">결제하기</button>
     </main>

     <script src="js/bridge.js"></script>
     <script>
       let cart = [];

       async function loadCart() {
         const result = await window.flutter_inappwebview.callHandler('getCart');
         cart = JSON.parse(result.cart);
         renderCart();
       }

       function renderCart() {
         const container = document.getElementById('cart-items');

         if (cart.length === 0) {
           container.innerHTML = '<p>장바구니가 비어있습니다.</p>';
           return;
         }

         container.innerHTML = cart.map((item, index) => `
           <div class="cart-item">
             <img src="${item.image}" alt="${item.title}">
             <div>
               <h3>${item.title}</h3>
               <p>$${item.price}</p>
               <div class="quantity">
                 <button onclick="updateQuantity(${index}, -1)">-</button>
                 <span>${item.quantity}</span>
                 <button onclick="updateQuantity(${index}, 1)">+</button>
               </div>
             </div>
             <button onclick="removeItem(${index})">삭제</button>
           </div>
         `).join('');

         const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
         document.getElementById('total').innerHTML = `
           <div class="total">
             <h2>총 금액: $${total.toFixed(2)}</h2>
           </div>
         `;
       }

       async function updateQuantity(index, change) {
         cart[index].quantity += change;
         if (cart[index].quantity <= 0) {
           cart.splice(index, 1);
         }
         await saveCart();
         renderCart();
       }

       async function removeItem(index) {
         cart.splice(index, 1);
         await saveCart();
         renderCart();
       }

       async function saveCart() {
         await window.flutter_inappwebview.callHandler('saveCart', JSON.stringify(cart));
       }

       async function checkout() {
         await FlutterBridge.showToast('결제 기능은 준비 중입니다!');
       }

       loadCart();
     </script>
   </body>
   </html>
   ```

#### 학습 포인트
- ✅ Promise.all을 사용한 병렬 API 호출
- ✅ 배열 조작 (splice, reduce)
- ✅ 조건부 렌더링 (빈 상태 처리)

---

### Phase 7: 권한 처리 및 뒤로가기 최적화 (1일)

#### 목표
권한 요청 및 UX 개선

#### 작업 내용
1. **권한 요청** (`lib/webview_screen.dart`의 initState)
   ```dart
   @override
   void initState() {
     super.initState();
     _requestPermissions();
   }

   Future<void> _requestPermissions() async {
     await Permission.photos.request();
     await Permission.camera.request();
   }
   ```

2. **로딩 인디케이터 추가**
   ```dart
   bool _isLoading = true;

   onLoadStop: (controller, url) {
     setState(() => _isLoading = false);
   },

   // build에서
   Stack(
     children: [
       InAppWebView(...),
       if (_isLoading)
         const Center(
           child: CircularProgressIndicator(),
         ),
     ],
   )
   ```

#### 학습 포인트
- ✅ permission_handler 사용
- ✅ Stack 위젯으로 로딩 표시
- ✅ 상태관리 (setState)

---

### Phase 8: 테스트 및 최종 정리 (1일)

#### 목표
전체 기능 테스트 및 문서화

#### 작업 내용
1. **기능 체크리스트**
   - [ ] 상품 목록 로드
   - [ ] 상품 상세 보기
   - [ ] 좋아요 추가/제거
   - [ ] 장바구니 추가/수량 조절
   - [ ] 이미지 선택 및 크롭
   - [ ] 뒤로가기 처리
   - [ ] 토스트 메시지

2. **README 작성**
   ```markdown
   # ShopLearn - WebView 기반 학습용 쇼핑몰

   ## 실행 방법
   flutter pub get
   flutter run

   ## 학습 내용
   - WebView와 JavaScript 브릿지 통신
   - SharedPreferences 데이터 저장
   - 이미지 선택 및 크롭
   ```

#### 학습 포인트
- ✅ 전체 흐름 이해
- ✅ 하이브리드 앱 개발 패턴
- ✅ 실무 프로젝트 구조

---

## 📊 학습 타임라인

| Phase | 내용 | 예상 소요 시간 | 누적 시간 |
|-------|------|---------------|----------|
| 1 | 프로젝트 초기 설정 및 WebView | 1일 | 1일 |
| 2 | JavaScript 브릿지 구축 | 1일 | 2일 |
| 3 | 상품 목록 웹 페이지 | 2일 | 4일 |
| 4 | 상품 상세 및 장바구니 | 2일 | 6일 |
| 5 | 이미지 선택 기능 | 1일 | 7일 |
| 6 | 좋아요/장바구니 페이지 | 1일 | 8일 |
| 7 | 권한 처리 및 최적화 | 0.5일 | 8.5일 |
| 8 | 테스트 및 정리 | 0.5일 | **9일** |

**총 예상 학습 시간: 약 9일 (하루 3-4시간 기준)**

---

## 🎓 단계별 학습 성과

### Phase 2 완료 시
- ✅ WebView와 JavaScript 브릿지 통신 이해
- ✅ addJavaScriptHandler 사용법
- ✅ SharedPreferences 활용

### Phase 4 완료 시
- ✅ Fetch API를 통한 REST API 호출
- ✅ 웹에서 상품 목록/상세 렌더링
- ✅ 장바구니 로직 구현

### Phase 5 완료 시
- ✅ 네이티브 기능(이미지 선택) 연동
- ✅ Base64 인코딩/디코딩
- ✅ 바이너리 데이터 처리

### 전체 프로젝트 완료 시
- ✅ **WebView 하이브리드 앱 개발 능력**
- ✅ **JavaScript ↔ Dart 통신 패턴 숙달**
- ✅ **실무 수준의 WebView 앱 구조 이해**
- ✅ **네이티브 기능 연동 경험**
- ✅ **포트폴리오 프로젝트 확보**

---

## 🔧 트러블슈팅 가이드

### 자주 발생하는 문제

1. **WebView가 로드되지 않음**
   - 해결: pubspec.yaml에 assets 경로 확인
   - Android: `allowFileAccess: true` 설정

2. **JavaScript 브릿지 호출 실패**
   - 해결: `onWebViewCreated`에서 핸들러 등록 확인
   - `window.flutter_inappwebview` 객체 존재 확인

3. **이미지 선택 권한 거부**
   - 해결: AndroidManifest.xml / Info.plist 권한 추가
   - `permission_handler` 사용

4. **SharedPreferences 데이터 안 보임**
   - 해결: async/await 확인
   - 타입 변환 확인 (String ↔ int)

---

## 💡 학습 팁

1. **Chrome DevTools 활용**
   - Android: chrome://inspect에서 WebView 디버깅
   - 콘솔 로그 확인

2. **단계별 진행**
   - 각 Phase별로 테스트하며 진행
   - 기능 하나씩 완성도 있게 구현

3. **코드 주석 작성**
   - 브릿지 통신 부분은 상세히 주석
   - 학습 노트로 활용

4. **반말티켓 코드 참고**
   - `/Users/jaehyeok/Desktop/2026/banmal/lib/webview.dart` 참고
   - 실전 패턴 학습

---

## 📚 추가 학습 자료

### 공식 문서
- [flutter_inappwebview 문서](https://inappwebview.dev/docs/)
- [FakeStore API](https://fakestoreapi.com/)
- [MDN JavaScript](https://developer.mozilla.org/ko/)

### 참고 파일
- [반말티켓 WebView 구현](/Users/jaehyeok/Desktop/2026/banmal/lib/webview.dart)
- [반말티켓 온보딩 문서](/Users/jaehyeok/Desktop/2026/banmal/docs/ONBOARDING.md)

---

## ✅ 프로젝트 체크리스트

### 필수 구현 항목
- [ ] WebView 기본 설정 완료
- [ ] JavaScript 브릿지 6개 핸들러 구현
- [ ] 상품 목록 렌더링
- [ ] 상품 상세 페이지
- [ ] 좋아요 기능 (네이티브 저장)
- [ ] 장바구니 기능 (네이티브 저장)
- [ ] 이미지 선택 및 크롭
- [ ] 뒤로가기 더블탭 종료
- [ ] 토스트 메시지

### 선택 구현 항목
- [ ] 검색 기능
- [ ] 카테고리 필터
- [ ] 로딩 애니메이션
- [ ] 다크모드

---

**이 문서는 Flutter WebView 학습 여정의 로드맵입니다. 실전 하이브리드 앱 개발 능력을 키워보세요! 🚀**
