// app/page.tsx (App Router 기준)
'use client';

import { useEffect, useState } from 'react';

export default function WebViewPage() {
  const [messageFromFlutter, setMessageFromFlutter] = useState('');

  // 1. Flutter에서 호출할 함수를 전역(window)에 등록
  useEffect(() => {
    (window as any).fromFlutter = (data: string) => {
      setMessageFromFlutter(data);
    };
  }, []);

  // 2. Flutter로 메시지 전송
  const sendMessageToFlutter = () => {
    if ((window as any).ToFlutter) {
      (window as any).ToFlutter.postMessage("안녕 Flutter! 나는 Next.js야.");
    } else {
      alert("Flutter 환경이 아닙니다.");
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }} className='text-blue-600'>
      <h1>Next.js Web</h1>
      <button onClick={sendMessageToFlutter} className='border-2 rounded-2xl border-amber-300 bg-amber-500 text-white hover:bg-amber-700 active:bg-amber-700 focus:outline-none p-3'>
        Flutter로 메시지 보내기
      </button>
      <p>받은 메시지: {messageFromFlutter}</p>
    </div>
  );
}