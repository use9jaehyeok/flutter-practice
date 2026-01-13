import 'package:flutter/material.dart';
import 'package:flutter_todo/screens/detail_screen.dart';
import 'package:flutter_todo/screens/write_screen.dart';
import '../models/todo.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.title});

  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<Todo> _todoList = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('할 일 목록')),
      body: _todoList.isEmpty
          ? Center(child: Text('할 일을 추가해보세요!'))
          : ListView.separated(
              itemCount: _todoList.length,
              itemBuilder: (context, index) {
                final todo = _todoList[index];
                return ListTile(
                  leading: Checkbox(
                    value: todo.isDone,
                    onChanged: (bool? value) {
                      setState(() {
                        todo.isDone = value!;
                      });
                    },
                  ),
                  title: Text(
                    todo.title,
                    style: TextStyle(
                      decoration: todo.isDone
                          ? TextDecoration.lineThrough
                          : null,
                    ),
                  ),
                  onTap: () => _navigateToDetail(todo),
                );
              },
              separatorBuilder: (context, index) => Divider(),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _navigateToWrite,
        child: Icon(Icons.add),
      ),
    );
  }

  void _navigateToWrite() async {
    final newTodo = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => WriteScreen()),
    );
    if (newTodo != null) {
      setState(() {
        _todoList.add(newTodo);
      });
    }
  }

  void _navigateToDetail(Todo todo) async {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => DetailScreen(todo: todo)),
    );
  }
}
