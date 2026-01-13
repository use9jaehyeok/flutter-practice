import 'dart:io';

import 'package:flutter/material.dart';
import '../models/todo.dart';

class DetailScreen extends StatelessWidget {
  final Todo todo;
  const DetailScreen({super.key, required this.todo});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(todo.title)),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          todo.imagePath != null
              ? Image.file(File(todo.imagePath!))
              : Container(
                  height: 250,
                  color: Colors.grey,
                  child: Center(child: Text('사진 없음')),
                ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  todo.title,
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                Divider(height: 30),
                Text(todo.description.isEmpty ? '내용이 없습니다.' : todo.description),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
