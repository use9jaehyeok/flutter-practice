import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:image_picker/image_picker.dart';

class MyWebView extends StatefulWidget {
  const MyWebView({super.key});

  @override
  _MyWebViewState createState() => _MyWebViewState();
}

class _MyWebViewState extends State<MyWebView> {
  late final InAppWebViewController? webViewController;
  late final _imagePicker = ImagePicker();
  final String _url = 'http://192.168.0.127:3000';
  File? _selectedImg;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      child: Scaffold(
        body: InAppWebView(
          initialUrlRequest: URLRequest(
            url: WebUri(Uri.parse(_url).toString()),
          ),
          onWebViewCreated: (controller) {
            webViewController = controller;
            webViewController?.addJavaScriptHandler(
              handlerName: 'sendSelectImg',
              callback: (args) async {
                print(args);
                if (args.isEmpty) {
                } else {
                  String _imgSrc = args[0]; // camera, gallery, values
                  _pickImage(ImageSource.camera);
                }
              },
            );
          },
        ),
      ),
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    final XFile? image = await _imagePicker.pickImage(
      source: source,
      maxHeight: 1800,
      maxWidth: 1800,
      imageQuality: 80,
    );

    if (image != null) {
      final file = File(image.path);
      final bytes = await file.readAsBytes();
      final base64Image = base64Encode(bytes);

      // 웹으로 base64 이미지 전달
      webViewController?.evaluateJavascript(
        source:
            "window.onNativeImageSelected && window.onNativeImageSelected('$base64Image');",
      );
    }
  }
}
