const EPGDimensions = {
  resize: function() {
      console.log("Resizing elements in EPG...");

      var screenWidth = $(window).width();
      var screenHeight = $(window).height();

      // Ajuste del contenedor principal de la EPG
      $("#epgContainer").css({
          width: screenWidth,
          height: screenHeight
      });

      // Ajuste de la grilla de la EPG
      var epgGridHeight = screenHeight * 0.8; // 80% del alto de la pantalla
      $("#epgGrid").css({ height: epgGridHeight });

      // Ajuste de los encabezados
      $("#epgHours").css({ width: screenWidth - 100 });
      $("#epgChannels").css({ height: epgGridHeight });

      console.log("EPG resized to:", screenWidth, "x", screenHeight);
  },

  updateEPGCellSize: function() {
      var screenWidth = $(window).width();
      var hourWidth = screenWidth / 8; // Dividir la pantalla en 8 bloques de tiempo

      $(".epg-cell").each(function() {
          $(this).css({ width: hourWidth });
      });

      console.log("EPG cells resized");
  },

  scaleEPGDetails: function() {
      var screenWidth = $(window).width();
      var screenHeight = $(window).height();

      $(".epg-dialog-details").css({
          width: screenWidth * 0.5, // 50% del ancho
          height: screenHeight * 0.5 // 50% del alto
      });

      console.log("EPG details window resized");
  }
};

// Ejecutar el ajuste de dimensiones en el evento de redimensionamiento
$(window).on("resize", function() {
  EPGDimensions.resize();
  EPGDimensions.updateEPGCellSize();
  EPGDimensions.scaleEPGDetails();
});
