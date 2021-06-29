!(function (window, document) {
  var resoluteWindows = [];
  function getPosition(element) {
    var el = element.getBoundingClientRect();
    return {
      top: el.top + window.pageYOffset,
      left: el.left + window.pageXOffset
    };
  }
  window.addEventListener('scroll', function () {
    var ResoluteFrame = document.getElementById('RESOLUTE_INSURANCE');
    var top = getPosition(ResoluteFrame).top;
    ResoluteFrame.contentWindow.postMessage(
      {
        parentScroll:
          window.pageYOffset < top ? 0 : window.pageYOffset - top + 8
      },
      '*'
    );
  });
  window.addEventListener('message', function (event) {
    var data = event.data;
    var ResoluteFrame = document.getElementById('RESOLUTE_INSURANCE');
    if (/__resolute__/.test(data))
      try {
        var message = JSON.parse(data.replace('__resolute__', ''));
        if (message.url) {
          window.location = message.url;
        } else if (message.getReferrer) {
          ResoluteFrame.contentWindow.postMessage(
            { location: window.location.href },
            '*'
          );
        } else if (message.scroll) {
          var top = getPosition(ResoluteFrame).top;
          window.scrollTo(1000, top);
        } else if (message.open && message.windowName) {
          resoluteWindows[message.windowName] = window.open(message.open);
        } else if (message.close && message.windowName) {
          var resoluteWindow = resoluteWindows[message.windowName];
          if (resoluteWindow) {
            resoluteWindow.close();
          }
        }
      } catch (error) {
        console.log(error.message);
      }
  });
})(window, document);
