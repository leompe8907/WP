const HomeDimensions = {
  resize: function() {
      console.log("Resizing elements in Home...");

      var screenWidth = $(window).width();
      var screenHeight = $(window).height();

      // Ajuste del contenedor principal
      $("#homeContainer").css({
          width: screenWidth,
          height: screenHeight
      });

      // Ajuste de los carruseles de contenido
      $(".carousel-container").each(function() {
          var newHeight = screenHeight * 0.4; // 40% del alto de la pantalla
          $(this).css({ height: newHeight });
      });

      // Ajuste del reproductor de video miniatura
      $("#miniPlayer").css({
          width: screenWidth * 0.3, // 30% del ancho
          height: screenHeight * 0.3 // 30% del alto
      });

      console.log("Home resized to:", screenWidth, "x", screenHeight);
  },

  adjustMenu: function() {
      var menuHeight = $("#homeMenu").outerHeight();
      var screenHeight = $(window).height();

      if (menuHeight > screenHeight * 0.8) { // Si el menú es demasiado grande
          $("#homeMenu").css({ height: screenHeight * 0.8 });
      } else {
          $("#homeMenu").css({ height: "auto" });
      }

      console.log("Menu adjusted:", $("#homeMenu").css("height"));
  },

  updateCarouselSize: function() {
      $(".carousel-container").each(function() {
          var containerWidth = $(this).width();
          var itemWidth = containerWidth / 4; // 4 elementos por fila
          $(this).find(".carousel-item").css({ width: itemWidth });
      });

      console.log("Carousels resized");
  },

  scaleVideoPlayer: function() {
      var screenWidth = $(window).width();
      var screenHeight = $(window).height();

      $("#videoPlayer").css({
          width: screenWidth * 0.6, // 60% del ancho
          height: screenHeight * 0.5 // 50% del alto
      });

      console.log("Video player resized");
  }
};

// Ejecutar el ajuste de dimensiones en el evento de redimensionamiento
$(window).on("resize", function() {
  HomeDimensions.resize();
  HomeDimensions.adjustMenu();
  HomeDimensions.updateCarouselSize();
  HomeDimensions.scaleVideoPlayer();
});
