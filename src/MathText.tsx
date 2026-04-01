import { useEffect, useRef, type RefObject } from 'react';
// @ts-ignore — katex/dist/contrib/auto-render không có bundled types
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';

/**
 * Hook tự động render LaTeX trong component ref hoặc toàn trang.
 * Nhận mảng dependencies để re-render khi dữ liệu thay đổi.
 */
export function useMathRender(dependencies: unknown[] = []): RefObject<HTMLElement | null> {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = containerRef.current || document.body;
    renderMathInElement(target, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
      throwOnError: false,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return containerRef;
}
