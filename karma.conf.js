module.exports = function (config) {
  config.set({
    files: [
    'js/vendor.js',
    'js/angular-app.js',
    'js/angular-app.spec.js',
    { pattern : './**/*.html', include: false },
    { pattern : './**/*.css', include: false }
    ],
    exclude: [
    ],

    browsers: ['Chrome'],
    // Chrome, ChromeCanary, Firefox, IE (only Windows), Opera, PhantomJS, Safari (only Mac)

    reporters: [
      'progress',
      'html',
      'coverage'
    ],
    preprocessors: {
      'js/angular-app.js': 'coverage'
    },
    // Optionally, configure the reporter:
    //
    coverageReporter: {
      type: 'html',
      dir: './../../coverage/'
    },

    basePath: './builds/development/',
    captureTimeout: 60000,
    colors: true,
    frameworks: ['jasmine'],
    logLevel: config.LOG_INFO,
    port: 9876,
    reportSlowerThan: 500,
    runnerPort: 9100
  });
};
