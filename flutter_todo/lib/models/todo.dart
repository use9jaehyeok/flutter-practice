class Todo {
  String id;
  String title;
  String description;
  String? imagePath;
  bool isDone;

  Todo({
    required this.id,
    required this.title,
    this.description = '',
    this.imagePath,
    this.isDone = false,
  });
}
