import 'package:flutter/material.dart';
import '../models/todo.dart';
import 'dart:io'; // File 클래스 사용을 위함
import 'package:image_picker/image_picker.dart';

class WriteScreen extends StatefulWidget {
  const WriteScreen({super.key});

  @override
  State<StatefulWidget> createState() => _WidgetScreenState();
}

class _WidgetScreenState extends State<WriteScreen> {
  final TextEditingController _titleController = TextEditingController();
  bool _showErrorTitle = false;
  File? _selectedImage; // 촬영한 이미지
  final ImagePicker _picker = ImagePicker();

  Future<void> _takePicture() async {
    final XFile? photo = await _picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 800,
    );

    if (photo != null) {
      setState(() {
        _selectedImage = File(photo.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('새 할 일 추가')),
      body: SingleChildScrollView(
        child: Padding(
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
              GestureDetector(
                onTap: _takePicture,
                child: Container(
                  height: 200,
                  width: double.infinity,
                  color: Colors.grey[300],
                  child: _selectedImage == null
                      ? Icon(
                          Icons.camera_alt,
                          size: 50,
                          color: Colors.grey[600],
                        )
                      : ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.file(_selectedImage!, fit: BoxFit.cover),
                        ),
                ),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  _takePicture();
                },
                child: Text('사진 촬영하기'),
              ),
            ],
          ),
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
                imagePath: _selectedImage?.path,
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
