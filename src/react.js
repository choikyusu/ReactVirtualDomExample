export function createElement(tagName, props, ...children) {
  return { tagName, props, children: children.flat() };
}

export function renderRealDOM(VirtualDOM) {
  if (typeof VirtualDOM === "string") {
    return document.createTextNode(VirtualDOM);
  }

  const $Element = document.createElement(VirtualDOM.type);

  if (Array.isArray(VirtualDOM.props.children)) {
    VirtualDOM.props.children
      .map(renderRealDOM)
      .forEach((node) => $Element.appendChild(node));
  } else {
    $Element.appendChild(renderRealDOM(VirtualDOM.props.children));
  }
  return $Element;
}

export function diffingUpdate(parent, nextNode, previousNode, parentIndex = 0) {
  if (typeof nextNode === "string" && typeof previousNode === "string") {
    if (nextNode === previousNode) return;
    return parent.replaceChild(
      renderRealDOM(nextNode),
      parent.childNodes[parentIndex]
    );
  }

  if (Array.isArray(nextNode.props.children)) {
    nextNode.props.children.forEach((_, index) => {
      diffingUpdate(
        parent.childNodes[parentIndex],
        nextNode.props.children[index],
        previousNode.props.children[index],
        index
      );
    });
  } else {
    diffingUpdate(
      parent.childNodes[parentIndex],
      nextNode.props.children,
      previousNode.props.children
    );
  }
}
