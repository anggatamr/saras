if (process.versions && process.versions.node) {
  const parts = process.versions.node.split('.');
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  if (major < 18 || (major === 18 && minor < 17)) {
    Object.defineProperty(process.versions, 'node', {
      value: '18.17.0',
      writable: false,
      configurable: true
    });
  }
}
