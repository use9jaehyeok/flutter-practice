import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MaterialApp(home: WebViewApp()));
}

class WebViewApp extends StatefulWidget {
  const WebViewApp({super.key});

  @override
  State<StatefulWidget> createState() => _WebViewAppState();
}

class _WebViewAppState extends State<WebViewApp> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'ToFlutter',
        onMessageReceived: (JavaScriptMessage message) {
          // Next.js 에서 보낸 메시지를 스낵바로 출력
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Next.js 메시지 ${message.message}')),
          );
          controller.runJavaScript('fromFlutter("반가워! 여긴 Flutter야.")');
        },
      )
      ..loadRequest(Uri.parse('http://localhost:3000'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter WebView')),
      body: WebViewWidget(controller: controller),
    );
  }
}
