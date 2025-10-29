function htmz(frame) {
  // no-history start
  if (frame.contentWindow.location.href === "about:blank") return;
  // no-history end

  // select start
  const fragments = decodeURIComponent(frame.contentWindow.location.hash).split(" ");
  frame.contentWindow.location.hash = fragments[0];
  const q = fragments.slice(1).join(" "); // `li, .listitem` is valid

  if (q) {
  frame.contentDocument.body.replaceChildren(
    ...frame.contentDocument.querySelectorAll(q || null)
  );
  }
  // select end

  setTimeout(() => {
  document
    .querySelector(frame.contentWindow.location.hash || null)
    ?.replaceWith(...frame.contentDocument.body.childNodes);

    // no-history start
    frame.remove();
    document.body.appendChild(frame);
    // no-history end
  });
}
