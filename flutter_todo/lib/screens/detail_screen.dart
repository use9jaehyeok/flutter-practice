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
          Container(
            constraints: const BoxConstraints(minHeight: 250),
            width: double.infinity,
            color: Colors.grey,
            child: todo.imagePath == null
                ? const SizedBox(
                    height: 250,
                    child: Center(child: Text('사진 없음')),
                  )
                : Image.file(File(todo.imagePath!), fit: BoxFit.fitWidth),
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
