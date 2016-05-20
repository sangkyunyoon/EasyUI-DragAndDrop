'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easyui = require('easyui'),
    Element = easyui.Element;

var util = require('./util'),
    DroppableElement = require('./droppableElement'),
    RootDirectory = require('./explorer/draggableEntry/rootDirectory');

var Explorer = function (_DroppableElement) {
  _inherits(Explorer, _DroppableElement);

  function Explorer(selector, rootDirectoryName, activateFileHandler, moveFileHandler, moveDirectoryHandler) {
    _classCallCheck(this, Explorer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Explorer).call(this, selector));

    var rootDirectory = RootDirectory.clone(rootDirectoryName, _this.onDragEvent.bind(_this), _this.onActivateFileEvent.bind(_this));

    _this.activateFileHandler = activateFileHandler;
    _this.moveFileHandler = moveFileHandler;
    _this.moveDirectoryHandler = moveDirectoryHandler;

    _this.rootDirectory = rootDirectory;

    _this.append(rootDirectory);
    return _this;
  }

  _createClass(Explorer, [{
    key: 'addFile',
    value: function addFile(filePath, readOnly) {
      this.rootDirectory.addFile(filePath, readOnly);
    }
  }, {
    key: 'addDirectory',
    value: function addDirectory(directoryPath, collapsed) {
      this.rootDirectory.addDirectory(directoryPath, collapsed);
    }
  }, {
    key: 'directoryPathContainingMarker',
    value: function directoryPathContainingMarker() {
      return this.rootDirectory.directoryPathContainingMarker();
    }
  }, {
    key: 'addMarkerInPlace',
    value: function addMarkerInPlace(entry) {
      var entryPath = entry.getPath(),
          entryType = entry.getType(),
          entryIsTopmost = util.isTopmost(entryPath);

      if (!entryIsTopmost) {
        var markerPath = entryPath;

        this.rootDirectory.addMarker(markerPath, entryType);
      } else {
        _get(Object.getPrototypeOf(Explorer.prototype), 'addMarker', this).call(this, entry);
      }
    }
  }, {
    key: 'addMarker',
    value: function addMarker(entry) {
      var directoryPathOverlappingEntry = this.rootDirectory.directoryPathOverlappingEntry(entry);

      if (directoryPathOverlappingEntry === null) {
        this.addMarkerInPlace(entry);
      } else {
        var entryName = entry.getName(),
            entryType = entry.getType(),
            entryPath = entry.getPath(),
            rootDirectoryName = this.rootDirectory.getName(),
            entryTopmostDirectoryName = util.topmostDirectoryName(entryPath),
            markerPath = entryTopmostDirectoryName !== rootDirectoryName ? rootDirectoryName + '/' + entryName : directoryPathOverlappingEntry + '/' + entryName;

        this.rootDirectory.addMarker(markerPath, entryType);
      }
    }
  }, {
    key: 'removeMarker',
    value: function removeMarker() {
      if (this.rootDirectory.hasMarker()) {
        this.rootDirectory.removeMarker();
      } else {
        _get(Object.getPrototypeOf(Explorer.prototype), 'removeMarker', this).call(this);
      }
    }
  }, {
    key: 'hasMarker',
    value: function hasMarker() {
      if (this.rootDirectory.hasMarker()) {
        return true;
      } else {
        return _get(Object.getPrototypeOf(Explorer.prototype), 'hasMarker', this).call(this);
      }
    }
  }, {
    key: 'onActivateFileEvent',
    value: function onActivateFileEvent(activateFileEvent) {
      var file = activateFileEvent.getFile(),
          filePath = file.getPath(this.rootDirectory);

      this.activateFileHandler(filePath);
    }
  }, {
    key: 'startDragging',
    value: function startDragging(entry) {
      if (this.hasMarker()) {
        return false;
      }

      this.addMarkerInPlace(entry);

      return true;
    }
  }, {
    key: 'stopDragging',
    value: function stopDragging(entry) {
      var entryPath = entry.getPath(),
          elementHavingMarker = this.hasMarker() ? this : this.droppableElementHavingMarker(),
          directoryPathContainingMarker = elementHavingMarker.directoryPathContainingMarker(),
          entryPathWithoutBottommostName = util.pathWithoutBottommostName(entryPath),
          sourcePath = entryPathWithoutBottommostName,
          targetPath = directoryPathContainingMarker;

      if (sourcePath === null || sourcePath !== targetPath) {
        var entries = entry.getEntries();

        elementHavingMarker.dragEntries(entries, sourcePath, targetPath);
      }

      _get(Object.getPrototypeOf(Explorer.prototype), 'stopDragging', this).call(this);
    }
  }, {
    key: 'isKeepingMarker',
    value: function isKeepingMarker(entry) {
      var directoryPathOverlappingEntry = this.rootDirectory.directoryPathOverlappingEntry(entry),
          keepingMarker;

      if (directoryPathOverlappingEntry !== null) {
        this.removeMarker();

        this.addMarker(entry);

        keepingMarker = true;
      } else {
        keepingMarker = false;
      }

      return keepingMarker;
    }
  }, {
    key: 'toAddMarker',
    value: function toAddMarker(entry) {
      var entryPath = entry.getPath(),
          entryIsTopmost = util.isTopmost(entryPath),
          directoryPathOverlappingEntry = this.rootDirectory.directoryPathOverlappingEntry(entry),
          addMarker = !entryIsTopmost && directoryPathOverlappingEntry !== null;

      return addMarker;
    }
  }, {
    key: 'dragDirectory',
    value: function dragDirectory(directory, sourceDirectoryPath, targetDirectoryPath) {
      var movedDirectoryPath = this.moveDirectoryHandler(sourceDirectoryPath, targetDirectoryPath);

      if (false) {} else if (movedDirectoryPath === null) {
        directory.remove();
      } else if (movedDirectoryPath === targetDirectoryPath) {
        directory.remove();

        var collapsed = directory.isCollapsed();

        this.addDirectory(movedDirectoryPath, collapsed);
      } else if (movedDirectoryPath === sourceDirectoryPath) {}
    }
  }, {
    key: 'dragFile',
    value: function dragFile(file, sourceFilePath, targetFilePath) {
      var movedFilePath = this.moveFileHandler(sourceFilePath, targetFilePath);

      if (false) {} else if (movedFilePath === null) {
        file.remove();
      } else if (movedFilePath === targetFilePath) {
        file.remove();

        var readOnly = file.getReadOnly();

        this.addFile(movedFilePath, readOnly);
      } else if (movedFilePath === sourceFilePath) {}
    }
  }]);

  return Explorer;
}(DroppableElement);

Explorer.clone = function (selector, rootDirectoryName, activateFileHandler, moveFileHandler, moveDirectoryHandler) {
  return Element.clone(Explorer, selector, rootDirectoryName, activateFileHandler, moveFileHandler, moveDirectoryHandler);
};

Explorer.fromHTML = function (html, rootDirectoryName, activateFileHandler, moveFileHandler, moveDirectoryHandler) {
  return Element.fromHTML(Explorer, html, rootDirectoryName, activateFileHandler, moveFileHandler, moveDirectoryHandler);
};

module.exports = Explorer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYkVTMjAxNS9leHBsb3Jlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxTQUFTLFFBQVEsUUFBUixDQUFiO0lBQ0ksVUFBVSxPQUFPLE9BRHJCOztBQUdBLElBQUksT0FBTyxRQUFRLFFBQVIsQ0FBWDtJQUNJLG1CQUFtQixRQUFRLG9CQUFSLENBRHZCO0lBRUksZ0JBQWdCLFFBQVEseUNBQVIsQ0FGcEI7O0lBSU0sUTs7O0FBQ0osb0JBQVksUUFBWixFQUFzQixpQkFBdEIsRUFBeUMsbUJBQXpDLEVBQThELGVBQTlELEVBQStFLG9CQUEvRSxFQUFxRztBQUFBOztBQUFBLDRGQUM3RixRQUQ2Rjs7QUFHbkcsUUFBSSxnQkFBZ0IsY0FBYyxLQUFkLENBQW9CLGlCQUFwQixFQUF1QyxNQUFLLFdBQUwsQ0FBaUIsSUFBakIsT0FBdkMsRUFBb0UsTUFBSyxtQkFBTCxDQUF5QixJQUF6QixPQUFwRSxDQUFwQjs7QUFFQSxVQUFLLG1CQUFMLEdBQTJCLG1CQUEzQjtBQUNBLFVBQUssZUFBTCxHQUF1QixlQUF2QjtBQUNBLFVBQUssb0JBQUwsR0FBNEIsb0JBQTVCOztBQUVBLFVBQUssYUFBTCxHQUFxQixhQUFyQjs7QUFFQSxVQUFLLE1BQUwsQ0FBWSxhQUFaO0FBWG1HO0FBWXBHOzs7OzRCQUVPLFEsRUFBVSxRLEVBQVU7QUFBRSxXQUFLLGFBQUwsQ0FBbUIsT0FBbkIsQ0FBMkIsUUFBM0IsRUFBcUMsUUFBckM7QUFBaUQ7OztpQ0FDbEUsYSxFQUFlLFMsRUFBVztBQUFFLFdBQUssYUFBTCxDQUFtQixZQUFuQixDQUFnQyxhQUFoQyxFQUErQyxTQUEvQztBQUE0RDs7O29EQUNyRTtBQUFFLGFBQU8sS0FBSyxhQUFMLENBQW1CLDZCQUFuQixFQUFQO0FBQTREOzs7cUNBRTdFLEssRUFBTztBQUN0QixVQUFJLFlBQVksTUFBTSxPQUFOLEVBQWhCO1VBQ0ksWUFBWSxNQUFNLE9BQU4sRUFEaEI7VUFFSSxp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QixRQUF4QixFQUFrQyxpQkFBbEMsRUFBcUQsbUJBQXJELEVBQTBFLGVBQTFFLEVBQTJGLG9CQUEzRixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTLFFBQVQsR0FBb0IsVUFBUyxJQUFULEVBQWUsaUJBQWYsRUFBa0MsbUJBQWxDLEVBQXVELGVBQXZELEVBQXdFLG9CQUF4RSxFQUE4RjtBQUNoSCxTQUFPLFFBQVEsUUFBUixDQUFpQixRQUFqQixFQUEyQixJQUEzQixFQUFpQyxpQkFBakMsRUFBb0QsbUJBQXBELEVBQXlFLGVBQXpFLEVBQTBGLG9CQUExRixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiZXhwbG9yZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBlYXN5dWkgPSByZXF1aXJlKCdlYXN5dWknKSxcbiAgICBFbGVtZW50ID0gZWFzeXVpLkVsZW1lbnQ7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgRHJvcHBhYmxlRWxlbWVudCA9IHJlcXVpcmUoJy4vZHJvcHBhYmxlRWxlbWVudCcpLFxuICAgIFJvb3REaXJlY3RvcnkgPSByZXF1aXJlKCcuL2V4cGxvcmVyL2RyYWdnYWJsZUVudHJ5L3Jvb3REaXJlY3RvcnknKTtcblxuY2xhc3MgRXhwbG9yZXIgZXh0ZW5kcyBEcm9wcGFibGVFbGVtZW50IHtcbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIHJvb3REaXJlY3RvcnlOYW1lLCBhY3RpdmF0ZUZpbGVIYW5kbGVyLCBtb3ZlRmlsZUhhbmRsZXIsIG1vdmVEaXJlY3RvcnlIYW5kbGVyKSB7XG4gICAgc3VwZXIoc2VsZWN0b3IpO1xuXG4gICAgdmFyIHJvb3REaXJlY3RvcnkgPSBSb290RGlyZWN0b3J5LmNsb25lKHJvb3REaXJlY3RvcnlOYW1lLCB0aGlzLm9uRHJhZ0V2ZW50LmJpbmQodGhpcyksIHRoaXMub25BY3RpdmF0ZUZpbGVFdmVudC5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuYWN0aXZhdGVGaWxlSGFuZGxlciA9IGFjdGl2YXRlRmlsZUhhbmRsZXI7XG4gICAgdGhpcy5tb3ZlRmlsZUhhbmRsZXIgPSBtb3ZlRmlsZUhhbmRsZXI7XG4gICAgdGhpcy5tb3ZlRGlyZWN0b3J5SGFuZGxlciA9IG1vdmVEaXJlY3RvcnlIYW5kbGVyO1xuXG4gICAgdGhpcy5yb290RGlyZWN0b3J5ID0gcm9vdERpcmVjdG9yeTtcblxuICAgIHRoaXMuYXBwZW5kKHJvb3REaXJlY3RvcnkpO1xuICB9XG5cbiAgYWRkRmlsZShmaWxlUGF0aCwgcmVhZE9ubHkpIHsgdGhpcy5yb290RGlyZWN0b3J5LmFkZEZpbGUoZmlsZVBhdGgsIHJlYWRPbmx5KTsgfVxuICBhZGREaXJlY3RvcnkoZGlyZWN0b3J5UGF0aCwgY29sbGFwc2VkKSB7IHRoaXMucm9vdERpcmVjdG9yeS5hZGREaXJlY3RvcnkoZGlyZWN0b3J5UGF0aCwgY29sbGFwc2VkKTsgfVxuICBkaXJlY3RvcnlQYXRoQ29udGFpbmluZ01hcmtlcigpIHsgcmV0dXJuIHRoaXMucm9vdERpcmVjdG9yeS5kaXJlY3RvcnlQYXRoQ29udGFpbmluZ01hcmtlcigpOyB9XG5cbiAgYWRkTWFya2VySW5QbGFjZShlbnRyeSkge1xuICAgIHZhciBlbnRyeVBhdGggPSBlbnRyeS5nZXRQYXRoKCksXG4gICAgICAgIGVudHJ5VHlwZSA9IGVudHJ5LmdldFR5cGUoKSxcbiAgICAgICAgZW50cnlJc1RvcG1vc3QgPSB1dGlsLmlzVG9wbW9zdChlbnRyeVBhdGgpO1xuXG4gICAgaWYgKCFlbnRyeUlzVG9wbW9zdCkge1xuICAgICAgdmFyIG1hcmtlclBhdGggPSBlbnRyeVBhdGg7XG5cbiAgICAgIHRoaXMucm9vdERpcmVjdG9yeS5hZGRNYXJrZXIobWFya2VyUGF0aCwgZW50cnlUeXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIuYWRkTWFya2VyKGVudHJ5KVxuICAgIH1cbiAgfVxuXG4gIGFkZE1hcmtlcihlbnRyeSkge1xuICAgIHZhciBkaXJlY3RvcnlQYXRoT3ZlcmxhcHBpbmdFbnRyeSA9IHRoaXMucm9vdERpcmVjdG9yeS5kaXJlY3RvcnlQYXRoT3ZlcmxhcHBpbmdFbnRyeShlbnRyeSk7XG5cbiAgICBpZiAoZGlyZWN0b3J5UGF0aE92ZXJsYXBwaW5nRW50cnkgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWRkTWFya2VySW5QbGFjZShlbnRyeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlbnRyeU5hbWUgPSBlbnRyeS5nZXROYW1lKCksXG4gICAgICAgICAgZW50cnlUeXBlID0gZW50cnkuZ2V0VHlwZSgpLFxuICAgICAgICAgIGVudHJ5UGF0aCA9IGVudHJ5LmdldFBhdGgoKSxcbiAgICAgICAgICByb290RGlyZWN0b3J5TmFtZSA9IHRoaXMucm9vdERpcmVjdG9yeS5nZXROYW1lKCksXG4gICAgICAgICAgZW50cnlUb3Btb3N0RGlyZWN0b3J5TmFtZSA9IHV0aWwudG9wbW9zdERpcmVjdG9yeU5hbWUoZW50cnlQYXRoKSxcbiAgICAgICAgICBtYXJrZXJQYXRoID0gKGVudHJ5VG9wbW9zdERpcmVjdG9yeU5hbWUgIT09IHJvb3REaXJlY3RvcnlOYW1lKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgcm9vdERpcmVjdG9yeU5hbWUgKyAnLycgKyBlbnRyeU5hbWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0b3J5UGF0aE92ZXJsYXBwaW5nRW50cnkgKyAnLycgKyBlbnRyeU5hbWU7XG5cbiAgICAgIHRoaXMucm9vdERpcmVjdG9yeS5hZGRNYXJrZXIobWFya2VyUGF0aCwgZW50cnlUeXBlKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVNYXJrZXIoKSB7XG4gICAgaWYgKHRoaXMucm9vdERpcmVjdG9yeS5oYXNNYXJrZXIoKSkge1xuICAgICAgdGhpcy5yb290RGlyZWN0b3J5LnJlbW92ZU1hcmtlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlci5yZW1vdmVNYXJrZXIoKTtcbiAgICB9XG4gIH1cblxuICBoYXNNYXJrZXIoKSB7XG4gICAgaWYgKHRoaXMucm9vdERpcmVjdG9yeS5oYXNNYXJrZXIoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdXBlci5oYXNNYXJrZXIoKTtcbiAgICB9XG4gIH1cblxuICBvbkFjdGl2YXRlRmlsZUV2ZW50KGFjdGl2YXRlRmlsZUV2ZW50KSB7XG4gICAgdmFyIGZpbGUgPSBhY3RpdmF0ZUZpbGVFdmVudC5nZXRGaWxlKCksXG4gICAgICAgIGZpbGVQYXRoID0gZmlsZS5nZXRQYXRoKHRoaXMucm9vdERpcmVjdG9yeSk7XG5cbiAgICB0aGlzLmFjdGl2YXRlRmlsZUhhbmRsZXIoZmlsZVBhdGgpO1xuICB9XG5cbiAgc3RhcnREcmFnZ2luZyhlbnRyeSkge1xuICAgIGlmICh0aGlzLmhhc01hcmtlcigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5hZGRNYXJrZXJJblBsYWNlKGVudHJ5KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RvcERyYWdnaW5nKGVudHJ5KSB7XG4gICAgdmFyIGVudHJ5UGF0aCA9IGVudHJ5LmdldFBhdGgoKSxcbiAgICAgICAgZWxlbWVudEhhdmluZ01hcmtlciA9IHRoaXMuaGFzTWFya2VyKCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BwYWJsZUVsZW1lbnRIYXZpbmdNYXJrZXIoKSxcbiAgICAgICAgZGlyZWN0b3J5UGF0aENvbnRhaW5pbmdNYXJrZXIgPSBlbGVtZW50SGF2aW5nTWFya2VyLmRpcmVjdG9yeVBhdGhDb250YWluaW5nTWFya2VyKCksXG4gICAgICAgIGVudHJ5UGF0aFdpdGhvdXRCb3R0b21tb3N0TmFtZSA9IHV0aWwucGF0aFdpdGhvdXRCb3R0b21tb3N0TmFtZShlbnRyeVBhdGgpLFxuICAgICAgICBzb3VyY2VQYXRoID0gZW50cnlQYXRoV2l0aG91dEJvdHRvbW1vc3ROYW1lLFxuICAgICAgICB0YXJnZXRQYXRoID0gZGlyZWN0b3J5UGF0aENvbnRhaW5pbmdNYXJrZXI7XG5cbiAgICBpZiAoKHNvdXJjZVBhdGggPT09IG51bGwpXG4gICAgIHx8IChzb3VyY2VQYXRoICE9PSB0YXJnZXRQYXRoKSkge1xuICAgICAgdmFyIGVudHJpZXMgPSBlbnRyeS5nZXRFbnRyaWVzKCk7XG5cbiAgICAgIGVsZW1lbnRIYXZpbmdNYXJrZXIuZHJhZ0VudHJpZXMoZW50cmllcywgc291cmNlUGF0aCwgdGFyZ2V0UGF0aCk7XG4gICAgfVxuXG4gICAgc3VwZXIuc3RvcERyYWdnaW5nKCk7XG4gIH1cblxuICBpc0tlZXBpbmdNYXJrZXIoZW50cnkpIHtcbiAgICB2YXIgZGlyZWN0b3J5UGF0aE92ZXJsYXBwaW5nRW50cnkgPSB0aGlzLnJvb3REaXJlY3RvcnkuZGlyZWN0b3J5UGF0aE92ZXJsYXBwaW5nRW50cnkoZW50cnkpLFxuICAgICAgICBrZWVwaW5nTWFya2VyO1xuXG4gICAgaWYgKGRpcmVjdG9yeVBhdGhPdmVybGFwcGluZ0VudHJ5ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnJlbW92ZU1hcmtlcigpO1xuXG4gICAgICB0aGlzLmFkZE1hcmtlcihlbnRyeSk7XG5cbiAgICAgIGtlZXBpbmdNYXJrZXIgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZWVwaW5nTWFya2VyID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGtlZXBpbmdNYXJrZXI7XG4gIH1cblxuICB0b0FkZE1hcmtlcihlbnRyeSkge1xuICAgIHZhciBlbnRyeVBhdGggPSBlbnRyeS5nZXRQYXRoKCksXG4gICAgICAgIGVudHJ5SXNUb3Btb3N0ID0gdXRpbC5pc1RvcG1vc3QoZW50cnlQYXRoKSxcbiAgICAgICAgZGlyZWN0b3J5UGF0aE92ZXJsYXBwaW5nRW50cnkgPSB0aGlzLnJvb3REaXJlY3RvcnkuZGlyZWN0b3J5UGF0aE92ZXJsYXBwaW5nRW50cnkoZW50cnkpLFxuICAgICAgICBhZGRNYXJrZXIgPSAhZW50cnlJc1RvcG1vc3QgJiYgKGRpcmVjdG9yeVBhdGhPdmVybGFwcGluZ0VudHJ5ICE9PSBudWxsKTtcblxuICAgIHJldHVybiBhZGRNYXJrZXI7XG4gIH1cblxuICBkcmFnRGlyZWN0b3J5KGRpcmVjdG9yeSwgc291cmNlRGlyZWN0b3J5UGF0aCwgdGFyZ2V0RGlyZWN0b3J5UGF0aCkge1xuICAgIHZhciBtb3ZlZERpcmVjdG9yeVBhdGggPSB0aGlzLm1vdmVEaXJlY3RvcnlIYW5kbGVyKHNvdXJjZURpcmVjdG9yeVBhdGgsIHRhcmdldERpcmVjdG9yeVBhdGgpO1xuXG4gICAgaWYgKGZhbHNlKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1vdmVkRGlyZWN0b3J5UGF0aCA9PT0gbnVsbCkge1xuICAgICAgZGlyZWN0b3J5LnJlbW92ZSgpO1xuICAgIH0gZWxzZSBpZiAobW92ZWREaXJlY3RvcnlQYXRoID09PSB0YXJnZXREaXJlY3RvcnlQYXRoKSB7XG4gICAgICBkaXJlY3RvcnkucmVtb3ZlKCk7XG5cbiAgICAgIHZhciBjb2xsYXBzZWQgPSBkaXJlY3RvcnkuaXNDb2xsYXBzZWQoKTtcblxuICAgICAgdGhpcy5hZGREaXJlY3RvcnkobW92ZWREaXJlY3RvcnlQYXRoLCBjb2xsYXBzZWQpO1xuICAgIH0gZWxzZSBpZiAobW92ZWREaXJlY3RvcnlQYXRoID09PSBzb3VyY2VEaXJlY3RvcnlQYXRoKSB7XG5cbiAgICB9XG4gIH1cblxuICBkcmFnRmlsZShmaWxlLCBzb3VyY2VGaWxlUGF0aCwgdGFyZ2V0RmlsZVBhdGgpIHtcbiAgICB2YXIgbW92ZWRGaWxlUGF0aCA9IHRoaXMubW92ZUZpbGVIYW5kbGVyKHNvdXJjZUZpbGVQYXRoLCB0YXJnZXRGaWxlUGF0aCk7XG5cbiAgICBpZiAoZmFsc2UpIHtcblxuICAgIH0gZWxzZSBpZiAobW92ZWRGaWxlUGF0aCA9PT0gbnVsbCkge1xuICAgICAgZmlsZS5yZW1vdmUoKTtcbiAgICB9IGVsc2UgaWYgKG1vdmVkRmlsZVBhdGggPT09IHRhcmdldEZpbGVQYXRoKSB7XG4gICAgICBmaWxlLnJlbW92ZSgpO1xuXG4gICAgICB2YXIgcmVhZE9ubHkgPSBmaWxlLmdldFJlYWRPbmx5KCk7XG5cbiAgICAgIHRoaXMuYWRkRmlsZShtb3ZlZEZpbGVQYXRoLCByZWFkT25seSk7XG4gICAgfSBlbHNlIGlmIChtb3ZlZEZpbGVQYXRoID09PSBzb3VyY2VGaWxlUGF0aCkge1xuXG4gICAgfVxuICB9XG59XG5cbkV4cGxvcmVyLmNsb25lID0gZnVuY3Rpb24oc2VsZWN0b3IsIHJvb3REaXJlY3RvcnlOYW1lLCBhY3RpdmF0ZUZpbGVIYW5kbGVyLCBtb3ZlRmlsZUhhbmRsZXIsIG1vdmVEaXJlY3RvcnlIYW5kbGVyKSB7XG4gIHJldHVybiBFbGVtZW50LmNsb25lKEV4cGxvcmVyLCBzZWxlY3Rvciwgcm9vdERpcmVjdG9yeU5hbWUsIGFjdGl2YXRlRmlsZUhhbmRsZXIsIG1vdmVGaWxlSGFuZGxlciwgbW92ZURpcmVjdG9yeUhhbmRsZXIpO1xufTtcblxuRXhwbG9yZXIuZnJvbUhUTUwgPSBmdW5jdGlvbihodG1sLCByb290RGlyZWN0b3J5TmFtZSwgYWN0aXZhdGVGaWxlSGFuZGxlciwgbW92ZUZpbGVIYW5kbGVyLCBtb3ZlRGlyZWN0b3J5SGFuZGxlcikge1xuICByZXR1cm4gRWxlbWVudC5mcm9tSFRNTChFeHBsb3JlciwgaHRtbCwgcm9vdERpcmVjdG9yeU5hbWUsIGFjdGl2YXRlRmlsZUhhbmRsZXIsIG1vdmVGaWxlSGFuZGxlciwgbW92ZURpcmVjdG9yeUhhbmRsZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHBsb3JlcjtcbiJdfQ==