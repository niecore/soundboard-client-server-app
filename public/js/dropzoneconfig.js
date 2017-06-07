Dropzone.options.uploadArea = {
  paramName: 'file',
  maxFilesize: 20, // MB
  maxFiles: 10,
  dictDefaultMessage: 'Drag an your sound here (manual reload required)',
  acceptedFiles: ".mp3,.wav",
  init: function() {
    this.on('success', function( file, resp ){
      console.log( file );
      console.log( resp );
    });
  }
};
