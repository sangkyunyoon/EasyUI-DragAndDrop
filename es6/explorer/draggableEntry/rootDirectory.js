'use strict';

var easyui = require('easyui'),
    Element = easyui.Element;

var util = require('../../util'),
    Directory = require('./directory');

class RootDirectory extends Directory {
  constructor(selector, name, dragEventHandler, activateFileEventHandler) {
    var collapsed = false;  ///

    super(selector, name, collapsed, dragEventHandler, activateFileEventHandler);
  }
  
  isRootDirectory() {
    return true;
  }

  getDirectoryOverlappingEntry(entry, noDraggingIntoSubdirectories) {
    var directoryOverlappingEntry;
    
    if (noDraggingIntoSubdirectories) {
      var overlappingEntry = this.isOverlappingEntry(entry);

      directoryOverlappingEntry = overlappingEntry ?
                                    this :
                                      null;
    } else {
      directoryOverlappingEntry = super.getDirectoryOverlappingEntry(entry);
    }
    
    return directoryOverlappingEntry;    
  }

  addFile(filePath) {
    var filePathWithoutRootDirectoryName = util.pathWithoutTopmostDirectoryName(filePath);

    if (filePathWithoutRootDirectoryName !== null) {
      super.addFile(filePathWithoutRootDirectoryName);
    }
  }

  addDirectory(directoryPath, collapsed) {
    var directoryPathWithoutRootDirectoryName = util.pathWithoutTopmostDirectoryName(directoryPath);

    if (directoryPathWithoutRootDirectoryName !== null) {
      super.addDirectory(directoryPathWithoutRootDirectoryName, collapsed);
    }
  }

  removeFile(filePath, removeEmptyParentDirectories) {
    var filePathWithoutRootDirectoryName = util.pathWithoutTopmostDirectoryName(filePath);

    if (filePathWithoutRootDirectoryName !== null) {
      super.removeFile(filePathWithoutRootDirectoryName, removeEmptyParentDirectories);
    }
  }

  removeDirectory(directoryPath, removeEmptyParentDirectories) {
    var directoryPathWithoutRootDirectoryName = util.pathWithoutTopmostDirectoryName(directoryPath);

    if (directoryPathWithoutRootDirectoryName !== null) {
      super.removeDirectory(directoryPathWithoutRootDirectoryName, removeEmptyParentDirectories);
    }
  }

  addMarker(markerPath, entryType) {
    var markerPathWithoutRootDirectoryName = util.pathWithoutTopmostDirectoryName(markerPath);

    super.addMarker(markerPathWithoutRootDirectoryName, entryType);
  }

  static clone(name, dragEventHandler, activateFileEventHandler) {
    var rootDirectory = Element.clone(RootDirectory, '#directory', name, dragEventHandler, activateFileEventHandler);

    rootDirectory.removeAttribute('id');

    return rootDirectory;
  }
}

module.exports = RootDirectory;
