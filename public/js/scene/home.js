Scene_Home = (function (Scene) {

  var Scene_Home = function () {
    this.construct.apply(this, arguments);
  };

  $.extend(true, Scene_Home.prototype, Scene.prototype, {
    /**
     * @inheritdoc Scene#init
     */
    init: function () {
      console.log("Scene_Home init");
      this.$firstFocusableItem = this.$el.find(".channels-div .focusable").first();
      this.viewport = $("#viewport");
      this.channelsGrid = $("#channelsGrid");
      this.playbackMetadata = { type: '', id: '' };
      this.requestingData = false;
      this.$videoContainer = $("#divVideoContainer");
      this.$maxiPreview = $(".maxipreview");  // Contenedor que recibe el foco
      this.$maximizeIcon = $("#maximizeIcon"); // Ícono de maximización
      this.$lastFocused = false;
      this.firstLaunch = true;
      this.dontRedraw = false;
      this.aboutString = "";
      this.timeIntervalApp = null; //by minute
      this.currentVodCategoryId = 0;
      this.nbPlayerAttempts = 0;
      this.nbPlayerRetryTimeout = null;
      this.NBPLAYER_RETRY_AFTER_ERROR = true;
      this.verifyingUserSession = false;
      this.lastPlaybackTime = 0;
      this.autoSeek = false;
      this.forcePlayback = false;
      this.lastServiceIdPlayed = null;
      this.changeChannelTimer = null;
      this.changeChannelWait = 3 * 1000; //seconds
      this.stepLoad = 0;
      this.preventPlayerReload = false;
      this.isTizen = (Device.isTIZEN || Device.isSAMSUNG);
      this.isLG = Device.isLG || Device.isWEBOS;
      this.miniPlayerEnabled = CONFIG.app.miniPlayerEnabled === false ? false : true;
      this.initializeSearchEvents();
    },
    /**
     * @inheritdoc Scene#render
     */
    render: function () {

      if (this.dontRedraw) {
        return;
      }

      $("#catchupsRow").addClass("hidden");

      this.$el.find("#epgAtThisTimeLabel").html(__("EPGAtThisTime"));
      this.$el.find("#epgNextLabel").html(__("EPGNext"));
      this.$el.find("#menuTitleLabel").html(__("MenuTitle"));
      this.$el.find("#menuEPGLabel").html(__("MenuEPG"));
      this.$el.find("#menuAboutLabel").html(__("MenuAbout"));
      this.$el.find("#menuLogoutLabel").html(__("MenuLogout"));
      this.$el.find("#menuSearch").html(__("MenuSearch"));
      this.$el.find("#menuExitLabel").html(__("MenuExit"));
      this.$el.find("#menuUpdateDataLabel").html(__("MenuUpdateData"));
      this.$el.find("#menuCatchupModalLabel").html(__("MenuCatchups"));
      this.$el.find("#Home").html(__("MenuHome"));
      this.$el.find("#errorFind").html(__("ErrorFind"));
      this.$el.find("#customSearchInput").text(__("CustomSearch"))
      $(".epg-message").html(__("EPGLoading"));
      EPG.homeObject = this;
      VOD.homeObject = this;
      VODDetail.homeObject = this;
      nbPlayer.homeObject = this;

      if (!CONFIG.app.showTime) {
        $("#nbTime").addClass("hide");
      }

      var date = new Date();
      var self = this;
      User.updateLastInteraction();
      this.actionMinute();
      setTimeout(function () {
        self.timeIntervalApp = setInterval(self.actionMinute, 60000);
        self.actionMinute();
      }, (60 - date.getSeconds()) * 1000);

      if (CONFIG.app.logoPositionHome == 'right') {
        if (this.miniPlayerEnabled) {
          var percPlayer = $("#divVideoContainer").width() / $("#divVideoContainer").parent().parent().width() * 100;
          $("#divVideoContainer").parent().css({ 'width': percPlayer + '%' });

          var percLogo = (percPlayer / 3) * 2;
          $("#rightLogoImage").parent().css({ 'width': percLogo + '%' });
          //$("#rightLogoImage").css({'margin-top': '20%', 'width': '100%', 'padding': '1em'});

          var percInfo = 100 - percPlayer - percLogo;
          $(".header-row-info").css({ 'width': percInfo + '%' });
        } else {
          $("#divVideoContainer").parent().hide();
          $(".header-row-info").removeClass("col-sm-6").addClass("col-sm-10");
        }

        $("#topLogoImage").addClass("hide");
        $("#rightLogoImage").removeClass("hide");
        $("#rightLogoImage").attr("src", "assets/images/" + CONFIG.app.brand + "/logo-top.png");

      } else {
        $("#topLogoImage").removeClass("hide");
        $("#rightLogoImage").addClass("hide");
      }

      if (CONFIG.app.production) {
        this.$el.find("#menuEPGLabel").parent().addClass("hide");
      }

      if (CONFIG.app.brand == "meganet") {
        $("#menuEPGLabel").parent().hide();
      }

      if (CONFIG.app.brand === "jrmax") {
        const inputs = document.querySelectorAll(".header-row-info");
        inputs.forEach(input => {
          input.style.setProperty("color", "black", "important"); // Aplica color con !important
          input.querySelectorAll("*").forEach(child => {
            child.style.setProperty("color", "black", "important"); // Fuerza el color en todos los hijos
          });
        })
      }

      NbNetworkObserver.startObserver(function () { self.goOnline(); }, function () { self.goOffline(); });

      // if (CONFIG.app.brand == "bromteck") {
      // document.addEventListener("keydown", function(inEvent) {
      // 	var message = "<span class='key-log-info'>" + inEvent.keyCode + "</span>";
      // 	$(".key-log-info").remove();
      // 	$(".nb-alert-message-label").append(message);
      // });
      // }
    },


    /**
         * @inheritdoc Scene#focus
         */
    focus: function ($el) {
      if (!$el) {
        $el = this.getFocusable();
      }

      return Focus.to($el);
    },

    onFocus: function ($el) {
      this.focusCandidate = null;
      $(".focus-candidate").removeClass("focus-candidate");
      this.trigger('focus', $el);
    },

    actionMinute: function () {
      $("#nbTime").html(getDateFormatted(getTodayDate(), true));
      $(".vjs-control-bar .nb-vjs-vod-time").html(getDateFormatted(getTodayDate(), true));
      console.log("actionMinute ", getDateFormatted(getTodayDate(), true));

      if (HOME.actionsForCheckInactivity) {
        HOME.actionsForCheckInactivity();
      }
    },

    actionsForCheckInactivity: function () {
      if (nbPlayer.isPlaying()) {
        var self = this;
        var $container = nbPlayer.isFullscreen() ? nbPlayer.$mainVideo : $(".common:first");
        InactivityManager.appStatusAction($container, function () {
          nbPlayer.stopPlayer(true);
        }, function () {
          if (!nbPlayer.isFullscreen() && self.$lastFocused) {
            Focus.to(self.$lastFocused)
          }
        });
      }
    },

    /**
     * @inheritdoc Scene#activate
     */
    activate: function (id, categoryId) {

      if (this.dontRedraw) {
        if (id != null) {
          var $focus = null;
          if (this.currentVodCategoryId != null) {
            $focus = $("#vodContainer").find("[data-id='" + id + "'][data-category-id='" + this.currentVodCategoryId + "']");
          } else { // comes frome VODDetail, then search vod id item
            $focus = $("#vodRow").find("[data-id='" + id + "']");
          }

          if ($focus.length > 0) {
            Focus.to($focus);
          }
        }
      }

      if (this.requestingData) {
        return;
      }

      App.throbber();

      if (!this.dontRedraw) {
        $("#menuRow").addClass("hidden");
        this.firstLaunch = true;
      }
      this.aboutString = "";

      if (User.hasCredentials() && User.isLicenseActivated()) {
        this.aboutString = "<table>"
          + "<tr>"
          + "<td style='padding-right: 6em'>" + __("AboutVersion") + ":</td><td>" + CONFIG.version + "</td>"
          + "</tr>"
          + "<tr>"
          + "<td>" + __("LoginUsername") + ":</td><td>" + User.getUsername() + "</td>"
          + "</tr>"
          + "<tr>"
          + "<td>" + __("AboutCard") + ":</td><td>" + User.getLicense() + "</td>"
          + "</tr>"
          + "<tr>"
          + "<td>" + __("AboutDevelopedBy") + ":</td><td>" + CONFIG.app.developedBy + "</td>"
          + "</tr>";

        if (!this.dontRedraw) {
          this.clearData();
        } else {
          if (this.playbackMetadata && this.playbackMetadata.id != null) {
            this.forcePlayback = true;
            this.autoSeek = true;
            this.lastPlaybackTime -= 1;
            this.playContentWithAccess(this.playbackMetadata.type, this.playbackMetadata.id, this.playbackMetadata.url, this.playbackMetadata.item, true, false);
          }
        }
        this.getHomeData();
      } else if (User.hasCredentials()) {
        //activate license
        App.throbberHide();
        App.notification(__("Scene_Home"));
      } else {
        //login
        App.throbberHide();
        App.notification(__("Scene_Home"));
      }

    },

    clearData: function () {
      AppData.clearData();
      EPG.reset();
      VOD.reset();
      VODDetail.reset();
      $(".div-bouquet").remove();
      $("#tvChannelsRow").empty();
      $("#vodRow").empty()
      $("#catchupsRow").empty();
      $("#favoritesRow").empty();
      $("#catchupRecordingRow").empty();
      $("#catchupRecordingRow").empty();
      this.firstLaunch = true;
      this.$lastFocused = false;
    },

    getHomeData: function () {
      this.requestingData = true;

      if ($("#tvChannelsRow").find(".channel-video").length == 0) {
        this.stepLoad = 0;
      } else if ($("#catchupsRow").find(".channel-video").length == 0 && EPG.isEmpty()) {
        this.stepLoad = 1;
      } else if (EPG.isEmpty() && VOD.isEmpty()) {
        this.stepLoad = 3;
      } else if (VOD.isEmpty()) {
        this.stepLoad = 4;
      }

      switch (this.stepLoad) {
        case 0:
          this.getDataForServicesTV();
          break;
        case 1:
          this.getDataForCatchups();
          break;
        case 2:
          this.getDataForCatchupsRecorded();
          break;
        case 3:
          this.getEPGData();
          break;
        case 4:
          this.getVODData();
          break;
        case 5:
          this.getDataForAds();
          break;
      }

    },

    getDataForServicesTV: function () {
      var self = this;
      this.updateStepLoad(0);
      AppData.getDataForServicesTV(function (bouquets) {
        self.setBouquetsContent(bouquets);
        self.getDataForCatchups();
      });
    },

    getDataForCatchups: function () {
      var self = this;
      // get catchups with events
      this.updateStepLoad(1);
      App.throbber();
      AppData.getCatchupGroups(function (catchups) {
        App.throbberHide();
        self.setCatchupsContent(catchups);
        self.getDataForCatchupsRecorded();
        if(catchups.length > 0) {
          $("#catchups").removeClass("hidden");
        }
      });

    },

    getDataForCatchupsRecorded: function () {
      var self = this;
      this.updateStepLoad(2);
      AppData.getCatchupsRecorded(function (catchupsRecorded) {
        console.log(catchupsRecorded);
        self.setCatchupsRecordedContent(catchupsRecorded);

        $("#menuRow").removeClass("hidden");
        App.throbberHide();
        //if (self.firstLaunch) {
        self.getEPGData();
        //}
      });

    },

    getEPGData: function () {
      var self = this;
      this.updateStepLoad(3);
      //$("#menuEPGLabel").closest(".other-option").addClass("hidden");

      if (EPG.isEmpty()) {
        console.log("EPG start " + new Date());
        //App.throbber();
        AppData.getEPGByBouquet(function (servicesWithEPG) {
          //App.throbberHide();
          console.log("EPG received: " + servicesWithEPG + " " + new Date());
          if (self.playbackMetadata.type == "service" && self.firstLaunch) {
            // call for update current player metadata content
            //self.preventPlayerReload = true;
            //self.eventWhenCurrentLiveEnd();
            self.setPlayerMetadata();
          }
          EPG.draw(servicesWithEPG);
          //$("#menuEPGLabel").closest(".other-option").removeClass("hidden");
          self.getVODData();
        }, 0);
      } else {
        self.getVODData();
      }

      //EPG.draw([]);
      //this.getVODData();
    },

    getVODData: function () {
      var self = this;
      this.updateStepLoad(4);
      AppData.getVOD(function (categories) {
        console.log("VOD library received: ");
        console.log(categories);
        self.setVODContent(categories);
        if(categories.length > 0){
          $("#vod").removeClass("hidden");
        }

        self.getDataForAds();
      });
    },

    getDataForAds: function () {
      var self = this;
      this.updateStepLoad(5);

      AppData.getAds(function (ads) {
        console.log("Ads received for Home:", ads);

        // Filtrar los anuncios para 'top' y 'bottom'
        var topAds = ads.filter(ad => ad.locationType === 1);
        //var bottomAds = ads.filter(ad => ad.locationType === 0);
        console.log("Top Ads:", topAds);
        //console.log("Bottom Ads:", bottomAds);

        if (topAds.length > 0) {
          if (topAds.length > 1) {
            self.crearCarrusel('publicidad-home-top', topAds);
          } else {
            self.agregarPublicidad('publicidad-home-top', topAds[0]);
          }
        }

        // if (bottomAds.length > 0) {
        //   if (bottomAds.length > 1) {
        //     self.crearCarrusel('publicidad-home-bottom', bottomAds);
        //   } else {
        //     self.agregarPublicidad('publicidad-home-bottom', bottomAds[0]);
        //   }
        // }

        self.allDataLoaded();
      },
        function (error) {
          console.error("Error loading ads:", error);
          self.allDataLoaded();
        });
    },

    agregarPublicidad: function (contenedorPublicidad, ad) {
      var contenedor = document.querySelector(`.${contenedorPublicidad}`);
      if (!contenedor) {
        console.warn(`Container not found for ad: ${contenedorPublicidad}`);
        return;
      }
      // Crear el elemento de imagen para el anuncio
      var image = document.createElement("img");
      image.dataset.src = ad.file;
      image.alt = ad.name || "Advertisement";
      image.style.maxWidth = "100%";
      image.style.height = "auto";

      image.onload = () => {  // Elimina el atributo data-src una vez cargada la imagen
        image.src = image.dataset.src;
        delete image.dataset.src;
      };

      // Si hay un URL de acción, hacemos la imagen clickeable
      if (ad.actionUrl) {
        var link = document.createElement("a");
        link.href = ad.actionUrl;
        link.target = "_blank";
        link.appendChild(image);
        contenedor.appendChild(link);
      } else {
        contenedor.appendChild(image);
      }
      console.log(`Ad added to ${contenedorPublicidad}:`, ad);
    },

    crearCarrusel: function (contenedorPublicidad, ads) {
      var contenedor = document.querySelector(`.${contenedorPublicidad}`);
      if (!contenedor) {
        console.warn(`Container not found for carousel: ${contenedorPublicidad}`);
        return;
      }

      // Si no hay imágenes, ocultar el contenedor y salir
      if (!ads || ads.length === 0) {
        contenedor.style.display = "none"; // Oculta el contenedor
        return;
      }

      // Mostrar el contenedor y crear el carrusel
      contenedor.style.display = "block"; // Asegura que el contenedor sea visible

      let carouselItems = [];
      ads.forEach(ad => {
        carouselItems.push(`
          <div class="carousel-item" style="background-image: url('${ad.file}');">
            ${ad.actionUrl ? `<a href="${ad.actionUrl}" target="_blank" class="carousel-link"></a>` : ''}
          </div>
        `);
      });

      contenedor.innerHTML = `
        <div class="custom-carousel">
          <div class="carousel-track">
            ${carouselItems.join('')}
          </div>
        </div>
      `;

      // Lógica de movimiento automático
      const track = contenedor.querySelector('.carousel-track');
      let currentIndex = 0;

      setInterval(() => {
        currentIndex = (currentIndex + 1) % ads.length; // Rotación de imágenes
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }, 5000); // Cambia cada 5 segundos
    },





    allDataLoaded: function () {
      this.requestingData = false;
      this.firstLaunch = false;
      App.throbberHide();
    },

    /**
     * @inheritdoc Scene#onLangChange
     */
    onLangChange: function () {

    },
    /**
     * @inheritdoc Scene#onClick
     */
    onClick: function ($el, event) {
      if (this.trigger('click', $el, event) === false) {
        return false;
      }
      return this.onEnter.apply(this, arguments);
    },

    // funcion antigua para cargar la informacion del epg cuando se posa o entra en un canal
    onFocus: function ($el) {

      if (EPG.isShowed() && !nbPlayer.isFullscreen()) {
        EPG.onFocus($el);
        return;
      } else if (VOD.isShowed() && !VODDetail.isShowed() && !nbPlayer.isFullscreen()) {
        VOD.onFocus($el);
        return;
      } else if (VODDetail.isShowed() && !nbPlayer.isFullscreen()) {
        VODDetail.onFocus($el);
        return;
      }

      if (typeof $el.data("type") !== 'undefined' && typeof $el.data("id") !== 'undefined' && $el.data("id") != null) {
        var id = $el.data("id");

        if ($el.data("type") == "service") {
          var serviceTV = AppData.getServiceTV(id);
          if (serviceTV !== false) {
            this.focusServiceTV(serviceTV, false);
          }
        } else if ($el.data("type") == "catchup" || $el.data("type") == "catchup-event") {
          this.setMenuTitle(__("MenuCatchups"));
        } else if ($el.data("type") == "vod") {
          if ($el.data("id") == 0) {
            this.setMenuTitle(__("MoviesSubtitle"));
          } else {
            this.setMenuTitle(__("MenuMovies"));
          }
        }
      } else if (typeof $el.data("other-id") !== 'undefined') {
        this.$lastFocused = Focus.focused;
        var id = $el.data("other-id");
        if (id != null & id >= 0) {
          switch (id) {
            case 0: //reload
              this.setMenuTitle(__("MenuUpdateDataDescription"));
              break;
            case 1: //epg
              this.setMenuTitle(__("MenuEPGDescription"));
              break;
            case 2: //about
              this.setMenuTitle(__("MenuAbout"));
              break;
            case 3: //logout
              this.setMenuTitle(__("MenuLogout"));
              break;
            case 5: //search
              this.setMenuTitle(__("MenuSearch"));
              break;
          }
        }
      } else if (nbPlayer.isFullscreen()) {
        nbPlayer.onFocus();
      }
    },

    // onFocus: function ($el) {
    //   // Elimina la clase "focus-candidate" de cualquier elemento previamente enfocado.
    //   $(".focus-candidate").removeClass("focus-candidate");
    //   this.trigger('focus', $el);

    //   // Si la EPG está visible y el reproductor no está en pantalla completa, enfoca en la EPG.
    //   if (EPG.isShowed() && !nbPlayer.isFullscreen()) {
    //       EPG.onFocus($el);
    //       return;
    //   } else if (VOD.isShowed() && !VODDetail.isShowed() && !nbPlayer.isFullscreen()) {
    //       // Si VOD está visible, maneja el foco en el VOD.
    //       VOD.onFocus($el);
    //       return;
    //   } else if (VODDetail.isShowed() && !nbPlayer.isFullscreen()) {
    //       // Si se están mostrando detalles del VOD, maneja el foco en los detalles de VOD.
    //       VODDetail.onFocus($el);
    //       return;
    //   }

    //   // Verifica si hay un tipo y un id para el elemento enfocado.
    //   if (typeof $el.data("type") !== 'undefined' && typeof $el.data("id") !== 'undefined' && $el.data("id") != null) {
    //       var id = $el.data("id");

    //       if ($el.data("type") == "service") {
    //           // Obtiene la información del servicio de TV enfocado.
    //           var serviceTV = AppData.getServiceTV(id);
    //           if (serviceTV !== false) {
    //               // Si hay datos disponibles para el servicio, enfoca en el servicio.
    //               this.focusServiceTV(serviceTV, false);
    //           } else {
    //               // Si no hay datos para el servicio, muestra "No hay datos".
    //               $(".epg-message").text(__("EPGItemNoData")).show();
    //           }
    //       } else if ($el.data("type") == "catchup" || $el.data("type") == "catchup-event") {
    //           // Maneja el enfoque en un evento de catchup.
    //           this.setMenuFocusToCatchup($el.data("id"));
    //       }
    //   }
    // },

    /**
     * @inheritdoc Scene#onReturn
     */
    onReturn: function ($el, event) {
      console.log("go back");
      var self = this;

      //** di el dialogo de busqueda esta abierto, cierralo
      if (!$("#searchContainer").hasClass("hidden")) {
        self.hideSearchPanel();
        Focus.to(self.$lastFocused);
        return;
      }
      if (ParentalControlDlg.isShowed()) {
        ParentalControlDlg.close(ParentalControlDlg.cancelActions);
      } else if (InactivityManager.isShown()) {
        InactivityManager.continueWatching();
      } else if (nbPlayer.isFullscreen()) {
        this.onReturnFullscreen();
        return;
      } else if (EPG.isShowed()) {
        EPG.onReturn(function () {
          $("#channelsGrid").show();
          Focus.to(self.$lastFocused);
          self.$lastFocused = [];
        });

        if (self.$lastFocused.length == 0) {
          Focus.to($(".other-option[data-other-id='1']"));
        }
      } else if (VOD.isShowed() && !VODDetail.isShowed()) {
        VOD.onReturn(function () {
          $("#channelsGrid").show();
          Focus.to($("#vodRow .focusable:first"));
        });
      } else if (VODDetail.isShowed()) {
        VODDetail.onReturn(function () {
          Focus.to(self.$lastFocused);
        });
      } else if ($el.isInAlertConfirm(this.$el)) {
        $el.closeAlert(this.$el);
        Focus.to(this.$lastFocused);
      } else if ($el.isInAlertMessage(this.$el)) {
        $el.closeAlert(this.$el);
        Focus.to(this.$lastFocused);
      } else if ($el.isInAlertInput(this.$el)) {
        $el.closeAlert(this.$el);
        Focus.to(this.$lastFocused);
      } else {

        if (CONFIG.app.brand == "fotelka" || CONFIG.app.brand == "supercabo" || CONFIG.app.brand == "cablesatelite") {
          if (this.playbackMetadata && this.playbackMetadata.id && this.playbackMetadata.id != '') {
            this.goToFullscreen();
            return;
          }
        }

        var $focusTo = Focus.focused;
        if (Focus.focused != null && !Focus.focused.is(this.$videoContainer)) {
          if (this.miniPlayerEnabled) {
            $focusTo = this.$videoContainer;
          } else {
            $focusTo = Focus.focused;
          }
        }

        if ($focusTo) {
          if ($focusTo == Focus.focused) {
            this.$lastFocused = Focus.focused;
            this.$el.showAlertConfirm(__("AppCloseApp"), 'close_app', null, null, 'cancel');
          } else {
            Focus.to($focusTo);
          }
        }
      }
    },

    onReturnFullscreen: function ($el, callback) {
      var self = this;

      nbPlayer.onReturn($el, this.playbackMetadata, function (closePlayer) {

        if (closePlayer) {
          if (!self.miniPlayerEnabled) {
            self.$videoContainer.parent().hide(0);
            nbPlayer.nbPlayerResetContent(true);
          } else {
            nbPlayer.exitFullscreen();
          }
        }

        self.restartFocus();
        if (!self.miniPlayerEnabled) {
          self.playbackMetadata = {};
        }

        if (callback) {
          callback();
        }
      });
    },


    initializeSearchEvents: function () {
      console.log("Inicializando eventos de búsqueda..."); // Esto debería aparecer en la consola

      var self = this;
      var $input = $("#customSearchInput");

      if ($input.length === 0) {
          console.error("❌ No se encontró el input con ID #customSearchInput");
          return;
      } else {
          console.log("✅ Input encontrado correctamente");
      }

      // Removemos cualquier evento anterior
      $input.off("focus input blur");

      // Evento al enfocar
      $input.on("focus", function () {
          console.log("📝 Input enfocado");
          if ($input.val().trim() === "Buscar...") {
              $input.val("");
          }
      });

      // Evento al escribir en el input
      $input.on("input", function () {
          var query = $(this).val().trim();
          console.log("🔍 Texto ingresado: ", query); // Debe mostrar el texto que escribes

          if (query.length > 0) {
              self.filterChannels(query); // Llama a la función de búsqueda
          }
      });

      // Evento al desenfocar
      $input.on("blur", function () {
          if ($input.val().trim() === "") {
              $input.val("Buscar...");
          }
      });

      // Forzar eventos click para los resultados (por si no pasan por onClick)
      $(document).off("click.searchResult").on("click.searchResult", ".result-item", function (event) {
        var $el = $(this);
        console.log("🖱️ Click detectado en resultado");
        self.selectContent($el.data("id"), $el.data("type"));
        self.hideSearchPanel();
        event.stopPropagation(); // evita que el evento se pierda
      });

      // Forzar click para el botón cerrar
      $(document).off("click.closeSearch").on("click.closeSearch", "#closeSearchButton", function (event) {
        console.log("🖱️ Click detectado en botón cerrar");
        self.hideSearchPanel();
        event.stopPropagation();
      });
    },






    filterChannels: function (query) {
      var services = AppData.services; // Datos de canales
      var vods = AppData.allVods; // Datos de VOD
      var catchups = AppData.catchupGroups.length ? AppData.catchupGroups.map(function (group) { return group.events; }) : [];

      console.log("Datos disponibles - services:", services);
      console.log("Datos disponibles - vods:", vods);
      console.log("Datos disponibles - catchups:", catchups);

      var results = [];

      if (query && query.trim() !== "") {
        query = query.toLowerCase();

        // Filtrar Canales
        results = results.concat(services.filter(function (service) {
          return service.name.toLowerCase().indexOf(query) !== -1;
        }));

        // Filtrar VOD
        results = results.concat(vods.filter(function (vod) {
          return vod.name.toLowerCase().indexOf(query) !== -1;
        }));

        // Filtrar Catchups
        results = results.concat(catchups.filter(function (catchup) {
          return catchup.name.toLowerCase().indexOf(query) !== -1;
        }));
      }
      this.renderSearchResults(results);
    },

    renderSearchResults: function (results) {
      var $resultsContainer = document.getElementById("searchResults");
      if (!$resultsContainer) {
        console.error("Contenedor #searchResults no encontrado");
        return;
      }
      $resultsContainer.innerHTML = "";

      if (results.length === 0) {
        $resultsContainer.innerHTML = '<p id="errorFind">' + __("ErrorFind") + '</p>';
        return;
      }

      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var type = result.catchupGroupId ? "catchup" : (result.categories ? "vod" : "service");
        var logo = (type === "service") ? (result.img || "") : (type === "vod") ? (result.posterListURL || "") : (result.imageUrl || "");
        var name = result.name || "Sin nombre";

        var div = document.createElement("div");
        div.className = "result-item focusable";
        div.setAttribute("data-id", result.id);
        div.setAttribute("data-type", type);

        var img = document.createElement("img");
        img.src = logo || "ruta_a_imagen_por_defecto.jpg"; // Imagen por defecto si falta
        img.alt = name + " Logo";
        img.className = "channel-logo";

        var textDiv = document.createElement("div");
        textDiv.className = "channel";
        textDiv.innerText = name;
        div.appendChild(img);
        div.appendChild(textDiv);

        $resultsContainer.appendChild(div);
      }
    },



    selectContent: function (id, type) {
      var self = this;

      if (type === "service") {
        var service = AppData.getServiceTV(id);
        if (service && service.url) {
          this.playContentWithAccess("service", service.id, service.url, service, true, false);
        }
      } else if (type === "vod") {
        VODDetail.show(id, null, this)
      } else if (type === "catchup") {
        AppData.getTopLevelCatchupM3u8Url(id, function (url) {
          if (url) {
            nbPlayer.playContent("catchup", url);

          }
        });
      }
    },


    // Mostrar el buscador
    showSearchPanel: function () {
      $("#searchContainer").removeClass("hidden"); // Muestra el buscador
      $("#customSearchInput").val(""); // Limpia el input antes de mostrarlo
      $("#customSearchInput").focus(); // Pone el foco en el input para que puedas escribir
    },


    // Ocultar el buscador
    hideSearchPanel: function () {
      $("#searchContainer").addClass("hidden");
      $("#customSearchInput").val(""); // Limpiar el contenido del input
      $("#searchResults").empty(); // Limpiar los resultados
      $("#viewport").removeClass("no-scroll");
    },




    goToFullscreen() {
      try {

        this.$lastFocused = Focus.focused;
        nbPlayer.requestFullscreen();
        this.$videoContainer.parent().show(500);
      } catch (e) { }
    },

    goToHome() {
      this.Scene_Home.activate();
      console.log("regresa")
    },

    /**
     * @inheritdoc Scene#onEnter
     */
    onEnter: function ($el, event) {

      var self = this;

      if ($el.is("#catchups")) {
        // Muestra el modal de Catchups
        $("#catchupModal").modal("show");

        // Cargar los datos de Catchups si no están cargados
        if ($("#catchupModalContent").children().length === 0) {
            self.getDataForCatchups();
            const $catchupsRow = $("#catchupsRow").detach();  // Desconecta el contenido
            $("#catchupModalContent").append($catchupsRow);    // Lo agrega al modal
            $catchupsRow.removeClass("hidden");                // Muestra el contenido
        }
        return;
      }

      // Si el usuario presiona Enter miestras esta en el boton de cerrar
      if($el.is("#closeSearchButton")){
        self.hideSearchPanel();
        return
      }

      if($el.is("#vod")){
        if (id > 0) {
          this.currentVodCategoryId = null;
          this.$lastFocused = Focus.focused;
          VOD.show();
        }
      }

      // Verifica si el buscador está activo y si el foco está en una tecla del teclado virtual
      if (!$("#searchContainer").hasClass("hidden") && $el.hasClass("key")) {
        // Obtiene el valor de la tecla seleccionada
        var key = $el.data("key");
        var $input = $("#customSearchInput");
        var currentText = $input.text();

        // Borra el texto "Buscar..." si está presente
        if (currentText === "Buscar...") {
          $input.text(""); // Limpia el texto inicial
          currentText = ""; // Resetea el texto actual
        }

        // Maneja las teclas especiales y texto
        if (key === "space") {
          $input.text(currentText + " ");
        } else if (key === "clear") {
          $input.text(currentText.slice(0, -1));
        } else {
          $input.text(currentText + key);
        }

        // Actualiza los resultados en el buscador
        self.filterChannels($input.text());

        return; // Finaliza aquí para evitar otras acciones
      }

      // Si estamos en el buscador y seleccionamos un resultado
      if (!$("#searchContainer").hasClass("hidden") && $el.hasClass("result-item")) {
        var id = $el.data("id");
        var type = $el.data("type");

        console.log("Seleccionado desde el buscador: ID =", id, " Type =", type);
        self.selectContent(id, type); // Usa selectContent en vez de reproducir directamente
        self.hideSearchPanel(); // Oculta el panel de búsqueda
        return;
      }

      if (nbPlayer.isFullscreen()) {
        if ($el.hasClass('video-container')) {
          return false;
        }
        nbPlayer.manageOnEnter($el, function () {
          var next = AppData.getNextEpisode(self.playbackMetadata.item, self.playbackMetadata.item.currentSeasonId, self.playbackMetadata.item.currentEpisodeId);
          if (next != null) {
            self.playEpisode(self.playbackMetadata.item.currentVodObjectId, next);
          }
        }, function () {
          self.restartFocus();
        }, function () {
          self.openEPG();
        });
        return false;
      } else if (ParentalControlDlg.isShowed()) {
        ParentalControlDlg.onEnter($el);
        return;
      } else if (InactivityManager.isShown()) {
        InactivityManager.onEnter($el);
        return;
      } else if (EPG.isShowed() && !$el.hasClass('video-container') && !NBAlert.isInAlertInput(this.$el)) {
        EPG.onEnter($el, function (type, id, url, object) {
          self.playContentWithAccess(type, id, url, object, true, true);
        });
        return;
      } else if (VOD.isShowed() && !VODDetail.isShowed() && !$el.hasClass('video-container') && !$el.isInAlertConfirm(this.$el)) {
        VOD.onEnter($el, function (type, id, url, object) {
          self.playContent(type, id, url, object, false, false);
        });
        return;
      } else if (VODDetail.isShowed() && !$el.hasClass('video-container') && !$el.isInAlertConfirm(this.$el)) {
        VODDetail.onEnter($el);
        return;
      }

      if (typeof $el.data("id") !== 'undefined') {
        var id = $el.data("id");
        var type = $el.data("type");


        if (this.playbackMetadata && type == this.playbackMetadata.type && id == this.playbackMetadata.id && !this.firstLaunch) {
          this.goToFullscreen();
          return;
        }

        if (type == "service") {
          var serviceTV = AppData.getServiceTV(id);
          if (serviceTV !== false && serviceTV.url != null && serviceTV.url.length > 0) {
            this.playContentWithAccess(type, id, serviceTV.url, serviceTV, true, false);
          }
        } else if (type == "catchup") {
          if ($el.data("back") == true) {
            $("#catchupsRow").find(".row-catchup-dates:first").addClass("hidden");
            $("#catchupsRow").find(".row-catchup-events:first").addClass("hidden");
            $("#catchupsRow").find(".row-catchups:first").removeClass("hidden");

            var $focusTo = $("#catchupsRow").find(".row-catchups .focusable[data-id='" + id + "']:first");
            Focus.to($focusTo);
            $focusTo.focus();
          } else {
            var catchup = AppData.getCatchup(id);
            if (catchup !== false) {
              this.openCatchupCell(catchup);
            }
          }

        } else if (type == "catchup-date") {
          if ($el.data("back") == true) {
            $("#catchupsRow").find(".row-catchups:first").addClass("hidden");
            $("#catchupsRow").find(".row-catchup-events:first").addClass("hidden");
            $("#catchupsRow").find(".row-catchup-dates:first").removeClass("hidden");

            var $focusTo = $("#catchupsRow").find(".row-catchup-dates .focusable[data-id='" + id + "']:first");
            Focus.to($focusTo);
            $focusTo.focus();
          } else {
            var catchup = AppData.getCatchup(id);
            var dateString = $el.data("date");
            if (catchup !== false) {
              this.openCatchupDate(catchup, dateString);
            }
          }
        } else if (type == "catchup-event") {
          var eventId = $el.data("event-id");
          var catchup = null;
          if (eventId != null && typeof eventId != 'undefined' && eventId > 0) {
            catchup = AppData.getCatchupByEventId(eventId);
            id = eventId;
          } else {
            var group = $el.data("group");
            catchup = AppData.getCatchupEvent(group, id);
          }

          if (catchup == null) {
            return;
          }

          console.log(catchup);
          console.log("Play catchup event id " + id);

          AppData.getTopLevelCatchupM3u8Url(catchup.id, function (url) {
            console.log("Play CATCHUP with URL: " + url);
            if (url != null && url.length > 0) {
              self.playContentWithAccess(type, id, url, catchup, true, false);
            }
          });

        } else if (type == "vod") {
          if (id > 0) {
            this.currentVodCategoryId = null;
            //Router.go('voddetail', id, this.currentVodCategoryId, this);
            this.$lastFocused = Focus.focused;
            VODDetail.show(id, this.currentVodCategoryId, this);
          } else {
            // open all vod window
            VOD.show();
          }
        }

      } else if (typeof $el.data("other-id") !== 'undefined') {
        var id = $el.data("other-id");
        if (id != null & id >= 0) {
          console.log("other option ", id);
          switch (id) {
            case 0: //reload
              this.activate();
              break;
            case 1: //epg
              this.openEPG();
              break;
            case 2: //about
              this.$el.showAlertMessage(this.aboutString, "menuabout", __("SettingsCloseButton").toUpperCase());
              break;
            case 3: //logout
              this.$lastFocused = Focus.focused;
              this.$el.showAlertConfirm(__("LoginLogoutConfirm"), 'LoginLogoutConfirm', __("LoginLogoutButton"), __("LoginLogoutCancelButton"), 'cancel');
              break;
            case 4: //exit
              this.$lastFocused = Focus.focused;
              this.$el.showAlertConfirm(__("AppCloseApp"), 'close_app', null, null, 'cancel');
              break;
            case 5: //search
              this.showSearchPanel();
              break;
          }
        }
      } else if ($el.hasClass('video-container')) {
        if (this.miniPlayerEnabled) {
          this.goToFullscreen();

          Focus.to($(".exitFullscreenBtn"));
          $(".exitFullscreenBtn").focus();
        }
      } else if ($el.isInAlertMessage(this.$el)) {
        $el.closeAlert(this.$el);
        Focus.to(this.$lastFocused);
      } else if ($el.isInAlertConfirm(this.$el)) {
        var tag = $el.data("tag");
        if (typeof tag != 'undefined' && tag != null && tag.length > 0) {
          if (tag == "license_already_in_use") {
            this.activateLicense($el.is(this.$nbAlertConfirmOkButton));
            $el.closeAlert(this.$el);
            Focus.to(this.$videoContainer);
            return;
          } else if (tag == "MoviesContinuePlayback") {
            if ($el.is(this.$nbAlertConfirmOkButton)) {
              var timeResume = User.getVideoHistoryFor(this.playbackMetadata.type, this.playbackMetadata.id);
              nbPlayer.$player.currentTime(timeResume);
            }
            nbPlayer.$player.play();
            $el.closeAlert(this.$el);
            this.goToFullscreen();
            return;
          } else if (tag == "LoginLogoutConfirm") {
            if ($el.is(this.$nbAlertConfirmOkButton)) {
              $el.closeAlert(this.$el);
              cv.logout(function () {
                self.destroyScene();
              });
              return;
            } else {
              $el.closeAlert(this.$el);
              Focus.to(this.$lastFocused);
            }
          }
        }

        if ($el.is(this.$nbAlertConfirmOkButton)) {
          $el.closeAlert(this.$el);
          closeApp();
        } else {
          $el.closeAlert(this.$el);
          Focus.to(this.$lastFocused);
        }
      } else if (NBAlert.isInAlertInput(this.$el)) {
        NBAlert.enter(this);
        return;
      }
    },

    /**
     * @inheritdoc Scene#onBeforeGoBack
     */
    onBeforeGoBack: function (fromScene) {
      this.dontRedraw = true;
    },

    /**
     * @inheritdoc Scene#navigate
     */
    navigate: function (direction) {
      var $el = Focus.focused;

      // Si estoy en el navbar y me muevo hacia abajo me lleva al primer elemento del primer bouquet
      if ($el.hasClass("nav-btn") && direction === "down") {
        const $firstChannel = $("#tvChannelsRow .focusable").first();
        if ($firstChannel.length > 0) {
          Focus.to($firstChannel);
          return;
        }
      }

      // si estoy en el primer bouquet y me muevo hacia arriba me lleva al navbar
      if ($el.closest("#tvChannelsRow").length && direction === "up") {
        const $firstChannel = $("#tvChannelsRow .focusable").first();
        if ($el.is($firstChannel)) {
          const $firstNav = $(".nav-btn").first();
          if ($firstNav.length > 0) {
            Focus.to($firstNav);
            return;
          }
        }
      }

      // si estoy en algun elemento del navbar y me muevo en alguna direccion me desplazo en esa direccion
      if ($el.hasClass("nav-btn") && (direction === "right" || direction === "left")) {
        const $navButtons = $(".nav-btn:visible");
        const currentIndex = $navButtons.index($el);

        let newIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;

        if (newIndex >= 0 && newIndex < $navButtons.length) {
          const $nextNav = $navButtons.eq(newIndex);
          if ($nextNav.length > 0) {
            Focus.to($nextNav);
            return;
          }
        }
      }



      // Verifica si el buscador esta activo
      if (!$("#searchContainer").hasClass("hidden")) {
        $("#viewport").addClass("no-scroll"); // Bloquea el scroll
        event.preventDefault(); // Evita que las teclas afecten la pantalla principal

        var $keys = $(".key:visible");  // Teclas del teclado virtual
        var totalKeysPerRow = 6; // Número de teclas por fila del teclado
        var currentIndex = $keys.index($el);
        var $closeButton = $("#closeSearchButton");
        var $results = $("#searchResults .focusable");  // Resultados de búsqueda
        var currentResultIndex = $results.index($el);
        var totalResultsPerRow = 7;

        var $resultsContainer = $(".search-results"); // Contenedor de resultados
        var $result = $(".result-item"); // Todos los elementos de resultados
        var resultIndex = $result.index($el);
        var itemsPerRow = 7; // Número de elementos por fila
        var totalItems = $result.length;
        var containerHeight = $resultsContainer.height();
        var itemHeight = $result.outerHeight(true); // Altura de un elemento con márgenes

        console.log("Tecla seleccionada:", $el.text(), "Índice:", currentIndex);

        // **Regla 1**: Si estoy en el botón de cerrar y me muevo hacia arriba, no hacer nada
        if ($el.is($closeButton) && direction === "up") {
          return; //Mantener el foco en el botón de cerrar si se mueve hacia arriba
        }

        // **Regla 2**: Si el usuario está en el botón de cierre y presiona "Abajo", mover al teclado
        if ($el.is($closeButton) && direction === "down") {
          Focus.to($keys.first()); // Mover el foco en el primero botón
        }

        // **Regla 3**: Si estoy en la primera columna y me muevo a la izquierda, no hacer nada
        if ($el.hasClass("key") && direction === "left") {
          var index = $keys.index($el);
          if (index % totalKeysPerRow === 0) {
            return;
          }
        }

        // **Regla 4**: Si estoy en la última columna y me muevo a la derecha, pero no hay resultados, no hacer nada
        if ($el.hasClass("key") && direction === "right") {
          if ((currentIndex + 1) % totalKeysPerRow === 0) { // Última columna
            if ($results.length > 0) { // Si hay resultados
              Focus.to($results.first()); // Mover foco al primer resultado
              return;
            }
          } else {
            Focus.to($keys.eq(currentIndex + 1)); // Moverse a la siguiente tecla
            return;
          }
        }

        // **Reglas 5**: específicas para bajar a ESPACIO y BORRAR
        if (direction === "down") {
          if ([30, 31, 32].includes(currentIndex)) { // Posiciones de las teclas 4,5,6
            Focus.to($keys.filter("[data-key='space']")); // Mover a ESPACIO
            return;
          }
          if ([33, 34, 35].includes(currentIndex)) { // Posiciones de las teclas 7,8,9
            Focus.to($keys.filter("[data-key='clear']")); // Mover a BORRAR
            return;
          }
        }

        // **Regla 6**: Si estás en el botón ESPACIO y te mueves hacia arriba, ir a índice 31
        if ($el.data("key") === "space" && direction === "up") {
          Focus.to($keys.eq(31));
          return;
          }
        // ** Regla 7**: Si estás en el botón BORRAR y te mueves hacia arriba, ir a índice 34
        if ($el.data("key") === "clear" && direction === "up") {
          Focus.to($keys.eq(34));
          return;
        }

        // ** Regla 8**: Si estas en la barra del buscador y te mueves hacia arriba, no hacer nada
        if($el.is("#customSearchInput") && direction === "up"){
          return;
        }

        // ** Regla 9**: Si estas en la barra del buscador y te mueves hacia abajo, ir a la primera tecla
        if($el.is("#customSearchInput") && direction === "down"){
          Focus.to($keys.first());
          return;
        }

        // 👉 Si el foco está en el input de búsqueda, dejar usar flechas dentro del texto
        if (current.attr('id') === 'customSearchInput') {
          if (direction === 'right') {
            var cursorPos = current[0].selectionStart;
            var textLength = current.val().length;
            if (cursorPos === textLength) {
              // mover foco a siguiente (por ejemplo cerrar o resultados)
              Focus.to($("#closeSearchButton")); // o el primer resultado
            }
            return; // evitar mover foco si aún está escribiendo
          }

          if (direction === 'left') {
            // si querés volver desde el botón de cerrar al input
            Focus.to($("#customSearchInput"));
            var len = current.val().length;
            current[0].setSelectionRange(len, len); // cursor al final
            return;
          }

          // Permitir flechas arriba/abajo solo si querés salir del input
          if (direction === 'down') {
            Focus.to($(".result-item").first()); // primer resultado
            return;
          }
          return; // detener aquí para que no interfiera
        }

        // ** Navegación en el TECLADO VIRTUAL **
        if ($el.hasClass("key")) {
          if (direction === "up") {
            if (currentIndex < totalKeysPerRow) {
              // Si estamos en la primera fila, mover al botón de cerrar
              if ($closeButton.length > 0) {
                Focus.to($closeButton);
              }
              return;
            }
            Focus.to($keys.eq(currentIndex - totalKeysPerRow));
            return;
          } else if (direction === "down") {
            if (currentIndex + totalKeysPerRow >= $keys.length) {
              return;
            }
            Focus.to($keys.eq(currentIndex + totalKeysPerRow));
            return;
          } else if (direction === "left") {
            // Navegar a la tecla izquierda
            Focus.to($keys.eq(currentIndex - 1));
            return;
          }
          return;
        }

        // ** Navegación en los RESULTADOS **
        if ($el.hasClass("result-item")) {
          if (direction === "up") {
            var prevIndex = resultIndex - itemsPerRow;
            if (prevIndex >= 0) {
              Focus.to($results.eq(prevIndex));
              // Hacer Scroll hacia arriba
              var scrollPosition = $resultsContainer.scrollTop();
              var itemOffset = $results.eq(prevIndex).position().top;
              if (itemOffset < 0) {
                $resultsContainer.scrollTop(scrollPosition - itemHeight);
              }
              // subir directamente a la primera fila, aseguramos el scroll en 0
              if (prevIndex < itemsPerRow) {
                setTimeout(() => {
                  $resultsContainer.scrollTop(0);
                  requestAnimationFrame(() => {
                    $resultsContainer.scrollTop(0); // Forzar doble ajuste para asegurar la visibilidad completa
                  });
                }, 10);
              }
              return;
            }
          } else if (direction === "down") {
            var nextIndex = resultIndex + itemsPerRow;
            if (nextIndex < totalItems) {
              Focus.to($results.eq(nextIndex));
              // 🔹 Hacer Scroll si el elemento está fuera de la vista
              var scrollPosition = $resultsContainer.scrollTop();
              var itemOffset = $results.eq(nextIndex).position().top;
              if (itemOffset + itemHeight > containerHeight) {
                $resultsContainer.scrollTop(scrollPosition + itemHeight);
              }
              return;
            }

          } else if (direction === "left") {
            if (currentResultIndex % totalResultsPerRow === 0) {
              // Si estamos en el primer resultado, mover al último del teclado
              Focus.to($keys.last());
              return;
            }
            Focus.to($results.eq(currentResultIndex - 1));
            return;

          } else if (direction === "right") {
            if ((currentResultIndex + 1) % totalResultsPerRow === 0 || currentResultIndex === $results.length - 1) {
              return; // Ya estamos al final de la fila
            }
            Focus.to($results.eq(currentResultIndex + 1));
            return;
          }
          return;
        }

      } else {
        $("#viewport").removeClass("no-scroll"); // Restaura el scroll cuando el teclado se cierra
      }

      if (nbPlayer.isFullscreen()) {
        nbPlayer.navigate($el, direction);
        return;
      } else if (ParentalControlDlg.isShowed()) {
        ParentalControlDlg.navigate(direction);
        return;
      } else if ($el.isInAlertMessage(this.$el) || $el.isInAlertConfirm(this.$el)) { // navigate on dialog
        this.manageFocusOnAlert(direction, $el.data("parent-type"));
        return;
      } else if (NBAlert.isInAlertInput(this.$el)) {
        NBAlert.navigate(direction, $el.data("parent-type"));
        return;
      }

      if (EPG.isShowed() && !nbPlayer.isFullscreen()) {
        EPG.navigate(direction);
        return;
      } else if (VOD.isShowed() && !VODDetail.isShowed() && !nbPlayer.isFullscreen()) {
        VOD.navigate(direction);
        return;
      } else if (VODDetail.isShowed() && !nbPlayer.isFullscreen()) {
        VODDetail.navigate(direction);
        return;
      }

      var $focused = Focus.focused;
      var $focusTo = [];

      if (direction == "up") {
        $focusTo = this.getNextFocusable(direction);
      } else if (direction == "down") {
        $focusTo = this.getNextFocusable(direction);
      } else if (direction == "left") {
        $focusTo = $focused.prevAll(".focusable:visible:first");
      } else if (direction == "right") {
        $focusTo = $focused.nextAll(".focusable:visible:first");
      }

      if ($focusTo.length > 0) {
        Focus.to($focusTo);

        var $parent = $focusTo.parent();

        if ($focusTo.position().left < 0) {
          $parent.scrollLeft($parent.scrollLeft() - $focusTo.innerWidth() - 20);
        } else if (($focusTo.position().left + $focusTo.innerWidth()) > $parent.innerWidth()) {
          $parent.scrollLeft($parent.scrollLeft() + $focusTo.innerWidth() + 20);
        }

      } else {
        if (!$el.is(":visible")) {
          Focus.to($("#divVideoContainer"));
        }
      }

      return false;
    },

    getNextFocusable: function (direction) {

      var $itemAtPoint = [];
      var $focused = Focus.focused;
      var jumpTopTo = 0;

      var $currentRow = $focused.closest(".row");
      var $nextRow = $currentRow;
      var currentLeftPos = $focused.position().left;

      if (direction == 'up') {
        if ($focused.is(this.$videoContainer)) {
          return $focused;
        }

        $nextRow = $currentRow.prevAll(".row:visible:first");

        if ($nextRow == null || $nextRow.length == 0) {
          return this.$videoContainer;
        }

      } else if (direction == 'down') {
        if ($focused.is(this.$videoContainer)) {
          currentLeftPos = $focused.offset().left + $focused.width() / 2;
          var $nearItem = this.channelsGrid.getHomeFocusableItemAt($focused.offset().top + 20, currentLeftPos);
          if ($nearItem.length > 0) {
            return $nearItem;
          } else {
            $nextRow = this.channelsGrid.getHomeRowAt($focused.offset().top + 20, currentLeftPos);
            currentLeftPos = $focused.offset().left;
          }

        } else {
          $nextRow = $currentRow.nextAll(".row:visible:first");
        }

        if ($nextRow == null || $nextRow.length == 0) {
          return $focused;
        }
      }

      left = currentLeftPos + ($focused.width() / 2);

      // scroll if needed
      if ($nextRow != null && $nextRow.length > 0) {
        jumpTopTo = $nextRow.position().top + $nextRow.find(".focusable:visible:first").position().top + 20;
        var jump = 0;
        if ($nextRow.position().top < 0) {
          jump = $nextRow.position().top;
          jumpTopTo -= jump;
        } else if ($nextRow.position().top + $nextRow.height() > this.channelsGrid.height() - 20) {
          jump = ($nextRow.position().top + $nextRow.height()) - (this.channelsGrid.height() - 50);
          jumpTopTo -= jump;
        }
        this.channelsGrid.scrollTop(this.channelsGrid.scrollTop() + jump);
      }

      //get a focusable item at point
      $itemAtPoint = this.channelsGrid.getHomeFocusableItemAt(jumpTopTo, left);

      if ($itemAtPoint.length > 0) {
        return $itemAtPoint;
      }

      // search up to left
      var jumpX = 100;
      var x = 1;
      for (var i = (left - jumpX); i > 0; i -= jumpX) {
        console.log("Search up to left " + (x++) + " (x=" + i + ",y=" + jumpTopTo + ")");
        $itemAtPoint = this.channelsGrid.getHomeFocusableItemAt(jumpTopTo, i);

        if ($itemAtPoint.length > 0) {
          return $itemAtPoint;
        }
      }

      return $focused;
    },

    channelUp: function () {
      this.playNextPrevServiceTV(1);
    },

    channelDown: function () {
      this.playNextPrevServiceTV(-1);
    },

    play: function () {
      if (this.playbackMetadata && (this.playbackMetadata.type == "vod" || this.playbackMetadata.type == "catchup-event")) {
        if (nbPlayer.isPaused()) {
          nbPlayer.$player.play();
        }
      }
    },

    pause: function () {
      if (this.playbackMetadata &&  (this.playbackMetadata.type == "vod" || this.playbackMetadata.type == "catchup-event")) {
        if (!nbPlayer.isPaused()) {
          nbPlayer.$player.pause();
        }
      }
    },

    playPause: function () {
      if (this.playbackMetadata && (this.playbackMetadata.type == "vod" || this.playbackMetadata.type == "catchup-event")) {
        if (nbPlayer.isPaused()) {
          nbPlayer.$player.play();
        } else {
          nbPlayer.$player.pause();
        }
      }
    },

    keyFFAction: function () {
      nbPlayer.forwardXAction();
    },

    keyRWAction: function () {
      nbPlayer.backXAction();
    },

    keyStopAction: function () {
      this.resetPlayerContent(true, null, null, null);
    },

    keyGuideAction: function () {
      this.$lastFocused = Focus.focused;
      this.openEPG();
    },

    resetPlayerContent: function (minimize, fallbackMessage, type, item) {
      nbPlayer.nbPlayerResetContent(minimize);
      this.playbackMetadata = {};

      PlayerFallback.hide();
      if (fallbackMessage && fallbackMessage != "") {
        PlayerFallback.show(this.$videoContainer, fallbackMessage, type, item);
      }
    },

    /**
     * @inheritdoc Scene#create
     */
    create: function () {
      return $('#scene-home');
    },

    setBouquetsContent: function (data) {
      var self = this;
      var htmlRow = "";

      $("#tvChannelsRow").addClass("hidden");
      $("#tvChannelsRow").empty();
      if (data.length >= 1) {
        var tvChannels = data[0];

        if (tvChannels.items.length > 0) {
          htmlRow = this.getHTMLRowChannel(tvChannels, tvChannels.name, false);
          $("#tvChannelsRow").html(htmlRow);
          $("#tvChannelsRow").removeClass("hidden");
        }
      }

      // set favorites if needed
      this.setFavoritesRow();

      //$("#channelCategoryGroup").addClass("hidden");
      //$("#channelCategoryGroup").empty();
      if (data.length > 1) {
        //$("#channelCategoryGroup").removeClass("hidden");
        htmlRow = "";
        data.forEach(function (bouquet, index, array) {
          if (index > 0 && bouquet.items.length > 0) {
            htmlRow += self.getHTMLRowChannel(bouquet, bouquet.name, true);
          }
        });

        //$("#channelCategoryGroup").append(htmlRow);
        $(htmlRow).insertAfter("#favoritesRow");
      }

      // set first focusable item
      this.$firstFocusableItem = this.channelsGrid.find(".channels-div .focusable").first();

      App.notification(__("Scene_Home"));
      Focus.to(this.$firstFocusableItem);

      if (this.miniPlayerEnabled && this.firstLaunch) { // play first item when app data is loaded
        this.onEnter(Focus.focused, []);
      }
    },

    setCatchupsContent: function (data) {
      console.log(data);
      if (data.length > 0) {
        var rows = ""; // Aquí se generarán los bouquets
        data.forEach(function (catchup, index, array) {
          if (catchup.events != null && catchup.events.length > 0) {
            // Cada catchup se renderiza como un bouquet
            rows += `
              <div class="focusable" data-id="${catchup.epgStreamId}" data-type="catchup">
                <div class="catchup-title">${catchup.name}</div>
              </div>
            `;
          }
        });
        // HTML principal agrupado en bouquet
        var htmlRow = `
          <div class="col-sm-12 channels-div">
            <div class="vertical-slide row-catchups">
              ${rows}
            </div>
            <div class="row-catchup-dates hidden"></div>
            <div class="row-catchup-events hidden"></div>
          </div>
        `;
        $("#catchupsRow").html(htmlRow);
        $("#catchupsRow").removeClass("hidden");

        $("#menuCatchupModalLabel").html(__("MenuCatchups"));
      } else {
        $("#catchupsRow").addClass("hidden");
      }
    },


    setCatchupsRecordedContent: function (data) {
      if (data.length > 0) {

        var cells = "";

        data.forEach(function (catchup, index, array) {
          cells += '<div class="channel-video catchup-recorded focusable" data-id="' + catchup.event.id + '" data-event-id="' + catchup.event.id + '" data-type="catchup-event">'
            + '<div class="catchup-recorded-container">'
            + '<div class="no-padding"><img src="' + catchup.event.imageUrl + '" data-placeholder="' + catchup.image + '" alt=""></div>'
            + '<span>' + catchup.event.name + '</span>'
            + '<span>' + getDateFormatted(catchup.event.startDate, false) + ' ' + getDateFormatted(catchup.event.startDate, true) + ' - ' + getDateFormatted(catchup.event.endDate, true) + '</span></div>'
            + '</div>';
        });

        var minutesUsed = AppData.getCatchupRecordingsMinutesUsed();
        var minutesLimit = CONFIG.app.catchupRecordingHoursLimit * 60;
        var percentage = (minutesUsed / (minutesLimit)) * 100;
        percentage = percentage < 0 ? 0 : (percentage > 100 ? 100 : percentage);
        var used = minutesLimit - minutesUsed;
        used = (used > 0) ? minutesToTimeString(used) : "0hs";
        var availableText = __("CatchupTimeAvailable")
          .replaceAll("%s", used)
          .replaceAll("%dhs", minutesToTimeString(minutesLimit));

        var htmlRow = '<div class="col-sm-12 channels-div">'
          + '<h4 class="heading">' + __("CatchupRecordingTitle") + '</h4>'

          + '<div class="catchup-record-info">'
          + '<div class="catchup-record-available">'
          + '<div class="catchup-record-used" style="width: ' + percentage + '%"></div>'
          + '</div>'
          + '<h3>' + availableText + '</h3></div>'

          + '<div class="horizontal-slide row-catchups">'
          + cells
          + '</div>'
        '</div>';

        $("#catchupRecordingRow").html(htmlRow);
        $("#catchupRecordingRow").removeClass("hidden");

        addImgPlaceholder($("#catchupRecordingRow").find("img"));
        //addImgErrorEvent($("#catchupRecordingRow").find("img"));
      } else {
        $("#catchupRecordingRow").addClass("hidden");
      }
    },

    openCatchupCell: function (catchup) {
      // prepare dates
      var dates = [];
      var justDate = "";
      var style = "";
      catchup.events.forEach(function (event, index, array) {
        justDate = event.startDate.local().format('YYYY-MM-DD');
        if (dates.indexOf(justDate) < 0) {
          dates.push(justDate);
        }
      });

      dates.sort(function (a, b) {
        a = moment(a.startDate).utc(true);
        b = moment(b.startDate).utc(true);
        return a.startDate != null ? ((a.startDate > b.startDate) ? 1 : ((a.startDate < b.startDate) ? -1 : 0)) : 0;
      });

      if (catchup.background != null && typeof catchup.background != 'undefined') {
        style = " background-color: #" + catchup.background;
      }
      var cells = '<div class="channel-video focusable" data-id="' + catchup.epgStreamId + '" data-type="catchup" data-back="true" style="' + style + '">'
        + '<img src="' + catchup.img + '" alt="">'
        + '</div>';

      dates.forEach(function (dateItem, index, array) {
        cells += '<div class="channel-video focusable" data-id="' + catchup.epgStreamId + '" data-date="' + dateItem + '" data-type="catchup-date">'
          + '<div><span>' + getDateFormatted(moment(dateItem)) + '</span></div>'
          + '</div>';
      });

      $("#catchupsRow").find(".row-catchups:first").addClass("hidden");
      var $rowCatchupDates = $("#catchupsRow").find(".row-catchup-dates:first");
      $rowCatchupDates.removeClass("hidden");
      $rowCatchupDates.html(cells);

      // focus
      var $focusTo = $rowCatchupDates.find(".focusable:first");
      Focus.to($focusTo);
      $focusTo.focus();
    },

    openCatchupDate: function (catchup, dateString) {
      var events = catchup.events.filter(function (event) {
        return event.startDate.local().format("YYYY-MM-DD") == dateString;
      });

      if (catchup.background != null && typeof catchup.background != 'undefined') {
        style = " background-color: #" + catchup.background;
      }

      if(CONFIG.app.brand === "jrmax") {
        style = 'color:black';
      }

      var cells = '<div class="channel-video focusable" data-id="' + catchup.epgStreamId + '" data-type="catchup" data-back="true" style="' + style + '">'
        + '<img src="' + catchup.img + '" alt="">'
        + '</div>'
        + '<div class="channel-video focusable" data-id="' + catchup.epgStreamId + '" data-date="' + dateString + '" data-type="catchup-date" data-back="true">'
        + '<div><span>' + getDateFormatted(moment(dateString)) + '</span></div>'
        + '</div>';
      var config = Storage.get("cvClientConfig");
      var objetoConfig = JSON.parse(config);
      var cdnServers = objetoConfig.cdnServers[3].urls[1];

      events.forEach(function (event, index, array) {
        var src
        if (event.imageUrl != null || event.imageUrl != "null" || event.imageUrl != "") {
          src = event.imageUrl
        }
        else if (event.imageUrl == null || event.imageUrl == "null" || event.imageUrl == "") {
          src = cdnServers + "" + event.id + "/screenshot.jpg"
        }
        cells += '<div class="channel-video focusable" data-id="' + event.eventId + '" data-group="' + catchup.epgStreamId + '" data-type="catchup-event">'
          + '<div style = "position: relative"><img src="' + src + '"onerror="imgOnError(this)" alt=""><span style = "position: absolute; top:0;" class="event">' + event.name + '</span><span style = "position: absolute; bottom:0;" class="event">' + getDateFormatted(event.startDate, true) + ' - ' + getDateFormatted(event.endDate, true) + '</span></div>'
          + '</div>';
      });
      $("#catchupsRow").find(".row-catchup-dates:first").addClass("hidden");
      var $rowCatchupEvents = $("#catchupsRow").find(".row-catchup-events:first");
      $rowCatchupEvents.removeClass("hidden");
      $rowCatchupEvents.html(cells);

      // focus
      var $focusTo = $rowCatchupEvents.find(".focusable[data-date='" + dateString + "']:first");
      Focus.to($focusTo);
      $focusTo.focus();
    },

    setVODContent: function (categories) {
      var vodsCount = 0;
      categories.forEach(function (item) {
        vodsCount += item.vods.length;
      });

      if (vodsCount > 0) {
        var vods = AppData.getVodRecommended();
        var htmlRow = this.getHTMLRowVOD(vods, __("MenuMovies"), -1, (CONFIG.app.production ? false : true));
        $("#vodRow").html(htmlRow);
        $("#vodRow").removeClass("hidden");
      }
      VOD.draw(categories);
    },

    getHTMLRowChannel: function (row, title, isBouquet) {
      var headingStyle
      var boderJrMax
      if (CONFIG.app.brand === "supercabo") {
        headingStyle = "style='width: 15em; border-top: 2px solid; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0px 15px 15px 0px; border-color:orange'";
      }
      if (CONFIG.app.brand === "jrmax") {
        headingStyle = "style='color:black;'";
        boderJrMax = "border: 2px solid black;";
      }

      var html = `
        <div class="col-sm-12 channels-div" data-description="${row.description}">
          <h4 class="heading" ${headingStyle}>${title}</h4>
          <div class="swiper-container">
            <div class="swiper-wrapper">
              ${row.items.map(channel => `
                <div class="swiper-slide channel-video focusable channel-style" data-id="${channel.id}" data-type="service" style="${boderJrMax}; background-color: ${channel.backgroundColor ? '#' + channel.backgroundColor : 'transparent'};">
                  <img class="img-style" src="${channel.img}" onerror="imgOnError(this)" alt="">
                </div>
              `).join('')}
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          </div>
        </div>`;

      if (isBouquet) {
        html = `<div class='row div-bouquet'>${html}</div>`;
      }

      setTimeout(() => {
        new Swiper(".swiper-container", {
          slidesPerView: 9,
          spaceBetween: 10,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
      }, 100);

      return html;
    },

    getHTMLRowVOD: function (vods, title, idCategory, allOption) {
      // if (vods.length == 0) {
      // 	return "";
      // }
      var headingStyle
      if (CONFIG.app.brand === "supercabo") {
        headingStyle = "style='width: 15em; border-top: 2px solid; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0px 15px 15px 0px; border-color:orange'"
      }

      if (CONFIG.app.brand === "jrmax") {
        headingStyle = "style='color:black'"
      }

      var html = '<div class="col-sm-12 channels-div">'
        + '<h4 class="heading" ' + headingStyle + '>' + title + '</h4>'
        + '<div class="horizontal-slide">';

      //all movies item
      // if (allOption) {
      //   html += '<div class="channel-video vod-list vod-video focusable" data-id="0" data-type="vod">'
      //     + '<div class="vod-all-item"><i class="fa fa-film ' + headingStyle + '" aria-hidden="true"></i><span ' + headingStyle + '>' + __("MoviesAllVod") + '</span></div>'
      //     + '</div>';
      // }
      var config = Storage.get("base_url");

      vods.forEach(function (vod) {
        var posterInfoURL
        if (vod.posterInfoURL == undefined || vod.posterInfoURL == null || vod.posterInfoURL == "null") {
          posterInfoURL = config + "/cv_data_pub/images/" + vod.image1Id + "/v/vod_poster_list.jpg"
        }
        else {
          posterInfoURL = vod.posterInfoURL
        }

        html += '<div class="channel-video vod-list focusable" data-id="' + vod.id + '" data-category-id="' + idCategory + '" data-type="vod">'
          + '<img src="' + posterInfoURL + '" onerror="imgOnError(this)" alt="">'
          + '</div>';
      });
      html += '</div>'
        + '</div>';

      return html;
    },

    playContentWithAccess: function (type, id, url, item, reset, forceFullscreen) {
      if (type == this.playbackMetadata.type && id == this.playbackMetadata.id && !this.forcePlayback
        || ((this.playbackMetadata.item && item.isSeries && this.playbackMetadata.item.isSeries && this.playbackMetadata.item.currentEpisodeId == item.currentEpisodeId))) {
        this.goToFullscreen();
        return;
      }

      if (this.checkParentalControl(type, id, url, item, reset, forceFullscreen)) {
        return;
      }
    },

    playContent: function (type, id, url, item, reset, isAutoPlay) {
      if (type == this.playbackMetadata.type && id == this.playbackMetadata.id && !this.forcePlayback
        || ((this.playbackMetadata.item && item.isSeries && this.playbackMetadata.item.isSeries && this.playbackMetadata.item.currentEpisodeId == item.currentEpisodeId))) {
        this.goToFullscreen();
        return;
      }

      var self = this;
      this.forcePlayback = false;
      this.NBPLAYER_RETRY_AFTER_ERROR = true;
      this.resetNbPlayerRetryTimeout(typeof reset != 'undefined' && reset == true);

      // before change current content, save history
      if (!nbPlayer.isPaused() && this.playbackMetadata.type == 'vod') {
        var currentTime = parseInt(nbPlayer.$player.currentTime());
        User.setVideoHistoryFor({ type: this.playbackMetadata.type, id: this.playbackMetadata.id, time: currentTime });
      }

      PlayerFallback.hide();
      if (!isAutoPlay) {
        User.updateLastInteraction();
      }
      nbPlayer.playContent(type, url);
      this.setPlayerMetadata(type, id, url, item);
      this.goToFullscreen();

      if (!nbPlayer.isFullscreen()) {
        nbPlayer.$player.userActive(false);
      }

      //continue
      if (nbPlayer.nbPlayerAreControslActive() && !nbPlayer.isSideMenuOpened()) {
        Focus.to(nbPlayer.$playPauseButton);
      }

      var autoplay = true;
      if (this.autoSeek && this.lastPlaybackTime > 0) {
        nbPlayer.$player.currentTime(this.lastPlaybackTime);
        this.autoSeek = false;
        this.lastPlaybackTime = 0;
      } else if (type == 'vod') {
        var timeResume = User.getVideoHistoryFor(type, id);
        if (timeResume > 0) {
          if (nbPlayer.isFullscreen()) {
            this.onReturnFullscreen();
          }
          this.$el.showAlertConfirm(__("MoviesContinuePlayback"), "MoviesContinuePlayback", __("MoviesContinuePlaybackYes"), __("MoviesContinuePlaybackNo"), "ok");
          autoplay = false;
        } else {
          this.goToFullscreen();
        }
      }

      if (autoplay) {
        nbPlayer.$player.play();
        if (nbPlayer.isFullscreen()) {
          setTimeout(function () {
            nbPlayer.showControls();
          }, 300);
        } else {
          //  modificar maximizado de pantalla
          // if ((this.firstLaunch || CONFIG.app.brand != "telecable") && !isAutoPlay) {
          //   this.goToFullscreen();
          // }
          if ((CONFIG.app.brand == "fotelka") && !isAutoPlay) {
            this.goToFullscreen();
          }
        }
      }
      // else {
      //   nbPlayer.$player.pause();
      // }

      nbPlayer.setEvents(function (time) {
        self.playerOnProgress(time);
      }, function (error) {
        self.playerOnError(error);
      }, function () {
        self.playerOnEnded();
      });
    },

    setPlayerMetadata: function (type, id, url, item) {

      if (type == null && id == null && url == null && item == null) {
        if (this.playbackMetadata.type == "service") {
          var serviceTV = AppData.getServiceTV(this.playbackMetadata.id);
          // var liveEvent = AppData.getLiveEvent(serviceTV);
          // if (liveEvent != null) {
          // 	var nextEvent = AppData.getNextEvent(serviceTV, liveEvent);

          // }
          type = "service";
          id = this.playbackMetadata.id;
          url = this.playbackMetadata.url;
          item = serviceTV;
        } else {
          return;
        }
      }

      this.lastServiceIdPlayed = this.playbackMetadata.type == "service" ? this.playbackMetadata.id : null;
      this.playbackMetadata = { type: type, id: id, url: url, item: item };

      var titleTopText = "";
      var epgNowText = "";
      var epgNextText = "";
      var playerTime1Text = "";
      var playerTime2Text = "";
      var srcItemImage = "";
      var srcPlaceholder = "";
      var playerImageStyle = "";
      var showNext = false;
      var startTime = null;
      var endTime = null;

      if (type == "service") { //live

        titleTopText = item.lcn + " | " + item.name;
        srcItemImage = item.img;
        srcPlaceholder = item.img;

        if (item.backgroundColor != null && typeof item.backgroundColor != 'undefined') {
          playerImageStyle = " background-color: #" + item.backgroundColor;
        }

        var liveEvent = AppData.getLiveEvent(item);
        if (liveEvent != null) {
          var nextEvent = AppData.getNextEvent(item, liveEvent);

          epgNowText = "";
          epgNextText = "";
          playerTime1Text = "";
          playerTime2Text = "";

          if (liveEvent != null) {
            $("#nowEventLabel").html(getStringDate(liveEvent.startDate, "HH:mm") + ": " + (liveEvent.languages.length > 0 ? liveEvent.languages[0].title : ""));
            epgNowText = __("EPGAtThisTime") + ": " + (liveEvent.languages.length > 0 ? liveEvent.languages[0].title : "");
            playerTime1Text = getStringDate(liveEvent.startDate, "HH:mm") + " - " + getStringDate(liveEvent.endDate, "HH:mm");
          } else {
            $("#nowEventLabel").html(__("EPGItemNoData"));
          }

          if (nextEvent != null) {
            $("#nextEventLabel").html(getStringDate(nextEvent.startDate, "HH:mm") + ": " + (nextEvent.languages.length > 0 ? nextEvent.languages[0].title : ""));
            epgNextText = __("EPGNext") + ": " + (nextEvent.languages.length > 0 ? nextEvent.languages[0].title : "");
            playerTime2Text = getStringDate(nextEvent.startDate, "HH:mm") + " - " + getStringDate(nextEvent.endDate, "HH:mm");
          } else {
            $("#nextEventLabel").html(__("EPGItemNoData"));
          }

          srcItemImage = item.img;// liveEvent.imageUrl <= to display the event image
          startTime = liveEvent.startDate;
          endTime = liveEvent.endDate;
        } else {
          epgNowText = __("EPGAtThisTime") + ": " + __("EPGItemNoData");
          epgNextText = __("EPGNext") + ": " + __("EPGItemNoData");
        }
      } else if (type == "catchup-event") {
        var group = AppData.getCatchupGroup(item.catchupGroupId);
        titleTopText = group.lcn + " | " + group.name;

        //titleTopText = item.name;
        playerTime1Text = getStringDate(item.startDate, "HH:mm") + " - " + getStringDate(item.endDate, "HH:mm");
        srcItemImage = item.imageUrl;
        srcPlaceholder = group.img;

        if (group.background != null && typeof group.background != 'undefined') {
          playerImageStyle = " background-color: #" + group.background;
        }

        epgNowText = item.name;
        //epgNextText = "next catchup";
        startTime = item.startDate;
        endTime = item.endDate;
      } else if (type == "vod") {
        titleTopText = item.name;

        if (item.isSeries) {
          var season = item.seasons.filter(function (season) { return season.id == item.currentSeasonId });
          if (season.length > 0) {
            season = season[0];
            var episode = season.episodes.filter(function (episode) { return episode.id == item.currentEpisodeId });
            if (episode.length > 0) {
              titleTopText += " - " + episode[0].name;
            }
          }

          showNext = AppData.getNextEpisode(item, item.currentSeasonId, item.currentEpisodeId) != null;
        }
        img = item.extraImageURL;
        srcItemImage = img;
        srcPlaceholder = null;
      }

      var playerMetadata = {
        type: type,
        titleTop: titleTopText,
        epgNow: epgNowText,
        epgNext: epgNextText,
        time1: playerTime1Text,
        time2: playerTime2Text,
        epgImageSrc: srcItemImage,
        epgImageStyle: playerImageStyle,
        epgImagePlaceholder: srcPlaceholder,
        showNext: showNext,
        startTime: startTime,
        endTime: endTime
      };

      nbPlayer.setPlayerMetadata(playerMetadata);
    },

    eventWhenCurrentLiveEnd: function () {
      this.forcePlayback = true;
      this.playContentWithAccess(this.playbackMetadata.type, this.playbackMetadata.id, this.playbackMetadata.url, this.playbackMetadata.item, true, false);
    },

    playerOnProgress: function (time) {
      if (!nbPlayer.isPaused() && parseInt(this.lastPlaybackTime) == time) {
        return;
      }

      this.lastPlaybackTime = time

      //every 15 seconds save vod history
      if (this.playbackMetadata.type == "vod" && time % 15 == 0) {
        User.setVideoHistoryFor({ type: this.playbackMetadata.type, id: this.playbackMetadata.id, time: time });
      }
    },

    playerOnError: function (error) {
      console.log("NBPlayer error: ");
      console.log(error);

      if (this.NBPLAYER_RETRY_AFTER_ERROR) {
        this.retryPlayCurrentContent(error);
      }
    },

    playerOnEnded: function () {
      console.log("NBPlayer playback ended");

      if (this.playbackMetadata.type == "service") {
        this.eventWhenCurrentLiveEnd();
      } else {
        User.setVideoHistoryFor({ type: this.playbackMetadata.type, id: this.playbackMetadata.id, time: 0 });
        var currentType = this.playbackMetadata.type;

        if (currentType == "catchup-event") {
          var currentId = this.playbackMetadata.id;
          this.playbackMetadata = { type: '', id: '', url: '', item: '' };
          nbPlayer.nbPlayerResetContent(false);
          this.playNextCatchup(currentId);
        } else {
          nbPlayer.nbPlayerResetContent(true);
          Focus.to(this.$videoContainer);
          this.playbackMetadata = { type: '', id: '', url: '', item: '' };
        }
      }
    },

    playNextPrevServiceTV: function (next) {
      if (ParentalControlDlg.isShowed() || InactivityManager.isShown()) {
        return;
      }

      var currentId = null;
      if (this.playbackMetadata && this.playbackMetadata.type == "service") {
        currentId = this.playbackMetadata.id;
      } else if (PlayerFallback.isShown() && PlayerFallback.contentType == "service" && PlayerFallback.contentObject) {
        currentId = PlayerFallback.contentObject.id;
      }

      if (currentId) {
        var currentService = AppData.getServiceTV(currentId);
        var newChannel = AppData.getNextPrevServiceTV(currentService, next);
        this.playServiceTVByChannel(newChannel);
      }
    },

    focusServiceTV: function (serviceTV, updateFocus) {

      if (updateFocus) {
        var $newFocus = $("#tvChannelsRow").find("[data-id='" + serviceTV.id + "']");
        if ($newFocus.length > 0) {
          Focus.to($newFocus);
          $newFocus.parent().focus();
        }
      }

      $(".info-epg").addClass("hidden");
      $(".info-services").removeClass("hidden");
      $("#menuTitle").addClass("hidden");
      $("#channelInfoDiv").removeClass("hidden");

      $("#channelLcnLabel").html(serviceTV.lcn);
      $("#channelNameLabel").html(serviceTV.name);
      $("#nowEventLabel").html(__("EPGNoInformation"));
      $("#nextEventLabel").html(__("EPGNoInformation"));

      var self = this;
      this.setEpgTextInfo(serviceTV, __("EPGLoading"), __("EPGLoading"));

      AppData.getSimpleEpgByChannel(serviceTV.id, function () {
        console.log("EPG loaded for " + serviceTV.id);

        var liveEvent = AppData.getLiveEvent(serviceTV);
        if (liveEvent != null) {
          var nextEvent = AppData.getNextEvent(serviceTV, liveEvent);
          self.setEpgInfo(serviceTV, liveEvent, nextEvent);
          // self.preventPlayerReload = true;
          // self.eventWhenCurrentLiveEnd();
        } else {
          self.setEpgTextInfo(serviceTV, __("EPGItemNoData"), __("EPGItemNoData"));

        }
      });
    },

    setEpgTextInfo: function (channel, liveText, nextText) {
      if (Focus.focused.data("id") == Number(channel.id)) {
        $("#nowEventLabel").html(liveText);
        $("#nextEventLabel").html(nextText);
      }

      this.updatePlayerMetadataIfNeeded(channel);
    },

    setEpgInfo: function (channel, liveEvent, nextEvent) {
      if (Focus.focused.data("id") == Number(channel.id)) {
        if (liveEvent != null) {
          $("#nowEventLabel").html(getStringDate(liveEvent.startDate, "HH:mm") + ": " + (liveEvent.languages.length > 0 ? liveEvent.languages[0].title : ""));
        } else {
          $("#nowEventLabel").html(__("EPGItemNoData"));
        }

        if (nextEvent != null) {
          $("#nextEventLabel").html(getStringDate(nextEvent.startDate, "HH:mm") + ": " + (nextEvent.languages.length > 0 ? nextEvent.languages[0].title : ""));
        } else {
          $("#nextEventLabel").html(__("EPGItemNoData"));
        }
      }

      //update player metadata if needed
      this.updatePlayerMetadataIfNeeded(channel);
    },

    updatePlayerMetadataIfNeeded: function (channel) {
      //update player metadata if needed
      if (this.playbackMetadata && this.playbackMetadata.type == "service" && (channel == null || this.playbackMetadata.id == channel.id)) {
        this.setPlayerMetadata();
        console.log("EPG player data updated for " + (channel != null ? channel.id : "{no channel}"));
      }
    },

    playPrevServiceTV: function () {

    },

    playLastServiceTVPlayed: function () {
      if (this.lastServiceIdPlayed != null && this.playbackMetadata && (this.playbackMetadata.type == "" || this.playbackMetadata.type == "service")) {
        var newChannel = AppData.getServiceTV(this.lastServiceIdPlayed);
        this.playServiceTVByChannel(newChannel);
      }
    },

    playServiceTVByChannel: function (newChannel) {
      if (typeof newChannel !== 'undefined' && newChannel != null) {
        console.log("Play channel: " + newChannel.lcn);
        this.focusServiceTV(newChannel, !nbPlayer.isFullscreen());
        this.playContentWithAccess("service", newChannel.id, newChannel.url, newChannel, true, false);
        // if (nbPlayer.isFullscreen()) {
        // 	setTimeout(function() {
        // 		nbPlayer.showControls();
        // 	}, 300);
        // }
      }
    },

    getNearBottomItem: function (near) {
      if (near > 100) {
        return this.$videoContainer;
      }
      var itemByPoint = document.elementFromPoint(40, (this.channelsGrid.offset().top + 40) + near);

      var $newFocus = $(itemByPoint).find(".focusable:first");
      if ($newFocus.length == 0) {
        $newFocus = $(itemByPoint).closest(".focusable");

        if ($newFocus.length == 0) {
          return this.getNearBottomItem(near + 20);
        }
      }
      return $newFocus;
    },

    restartFocus: function () {
      if (VODDetail.isShowed()) {
        VODDetail.setFocus();
      } else {

        if (this.playbackMetadata) {
          if (this.playbackMetadata.type == "service" && this.playbackMetadata.item != null) {
            if (this.focusToChannelElement(this.playbackMetadata.item.id)) {
              return;
            }
          } else if (this.playbackMetadata.type == "catchup-event" && this.playbackMetadata.item != null) {
            if (this.focusToCatchupElement(this.playbackMetadata.item.catchupGroupId, this.playbackMetadata.item.eventId, this.playbackMetadata.item.startDate)) {
              return;
            }
          }
        }

        if (this.$lastFocused) {
          Focus.to(this.$lastFocused);
        } else {
          Focus.to(this.$videoContainer);
        }

      }
    },

    focusToChannelElement: function (channelId) {
      var channel = AppData.getServiceTV(channelId);
      if (channel != null) {
        var bouquetIds = channel.bouquetIds;
        for (var i = 0; i < bouquetIds.length; i++) {
          var $bouquet = this.channelsGrid.find(".div-bouquet[data-id='" + bouquetIds[i] + "']");

          if ($bouquet.length > 0) {
            var $horizontalSlide = $bouquet.find('.horizontal-slide');
            var $channel = $horizontalSlide.find('.channel-video[data-id="' + channel.id + '"]:first');

            if ($channel.length > 0) {
              this.channelsGrid.scrollTop(this.channelsGrid.scrollTop() + $bouquet.position().top);
              $horizontalSlide.scrollLeft($channel.position().left);

              // Check if channel is visible in viewport
              var channelRight = $channel.position().left + $channel.width();
              var containerWidth = $horizontalSlide.width();

              if (channelRight > containerWidth) {
                // Channel is off screen to the right, adjust scroll
                $horizontalSlide.scrollLeft($channel.position().left - containerWidth + $channel.width());
              } else if ($channel.position().left < 0) {
                // Channel is off screen to the left, scroll to it
                $horizontalSlide.scrollLeft($channel.position().left);
              }

              Focus.to($channel);
              return true;
            }
          }
        }
      }

      return false;
    },

    focusToCatchupElement: function (catchupGroupId, catchupId, catchupStartDate) {
      var catchupDate = catchupStartDate.local().format("YYYY-MM-DD");
      var catchup = AppData.getCatchup(catchupGroupId);
      this.openCatchupCell(catchup);
      this.openCatchupDate(catchup, catchupDate);

      var $catchupsRow = $("#catchupsRow");
      if ($catchupsRow.length > 0) {
        this.channelsGrid.scrollTop(this.channelsGrid.scrollTop() + $catchupsRow.position().top);
      }

      var $rowCatchupEvents = $("#catchupsRow").find(".row-catchup-events:first");
      var $catchupEvent = $rowCatchupEvents.find(".focusable[data-id='" + catchupId + "']:first");

      if ($catchupEvent.length > 0) {
        var eventRight = $catchupEvent.position().left + $catchupEvent.width();
        var containerWidth = $rowCatchupEvents.width();

        if (eventRight > containerWidth) {
          $rowCatchupEvents.scrollLeft($catchupEvent.position().left - containerWidth + $catchupEvent.width());
        } else if ($catchupEvent.position().left < 0) {
          $rowCatchupEvents.scrollLeft($catchupEvent.position().left);
        }

        Focus.to($catchupEvent);
        return true;
      }

      return false;
    },

    setMenuTitle: function (title) {
      $("#channelInfoDiv").addClass("hidden");
      $("#menuTitle").removeClass("hidden");
      $("#menuSelectedLabel").text(title);
    },

    setFavoritesRow: function () {
      var $favoritesRow = $("#favoritesRow");
      var favorites = AppData.getServicesTVFavoritedAsChannels();
      var $html = "";

      if (favorites != null) {
        $html = this.getHTMLRowChannel(favorites, favorites.name);
        $favoritesRow.html($html);
        $favoritesRow.removeClass("hidden");
      } else if ($favoritesRow.length > 0) {
        $favoritesRow.empty();
        $favoritesRow.addClass("hidden");
      }
    },

    retryPlayCurrentContent: function (error) {
      if (!this.NBPLAYER_RETRY_AFTER_ERROR) { return; }

      var self = this;
      var delay = 0;
      if (this.nbPlayerAttempts <= 6) {
        delay = 3;
      } else if (this.nbPlayerAttempts > 6 && this.nbPlayerAttempts <= 10) {
        delay = 10;
      } else {
        delay = 20;
      }

      if (this.nbPlayerRetryTimeout == null && !this.verifyingUserSession) {
        var lastTime = this.lastPlaybackTime;
        //nbPlayer.nbPlayerResetContent();
        //$("#mainVideo").addClass("vjs-waiting");
        if (this.nbPlayerAttempts % 3 == 0) {
          this.verifyUserSession(false, function (success) {
            if (success) {
              self.lastPlaybackTime = lastTime;
              self.retryPlayCurrentContentWithDelay(delay);
            } else {
              self.licenseEnded();
            }
          });
        } else {
          self.lastPlaybackTime = lastTime;
          this.retryPlayCurrentContentWithDelay(delay);
        }
      }

    },

    licenseEnded: function () {
      if (nbPlayer.isFullscreen()) {
        this.onReturnFullscreen();
      }
      this.NBPLAYER_RETRY_AFTER_ERROR = false;
      var self = this;
      NbNetworkObserver.simpleCheckInternetConnection(function () {
        self.$el.showAlertConfirm(__("SettingsLicenseUsedContinueHere"), "license_already_in_use", null, null, null);
      }, function () { });
    },

    activateLicense: function (activate) {
      var self = this;
      if (activate) {
        this.verifyUserSession(true, function (success) {
          if (success && self.playbackMetadata != null) {
            self.forcePlayback = true;
            self.playContent(self.playbackMetadata.type, self.playbackMetadata.item.id, self.playbackMetadata.item.url, self.playbackMetadata.item, false);
          } else {
            nbPlayer.nbPlayerResetContent();
          }
        });
      }
    },

    retryPlayCurrentContentWithDelay: function (delay) {
      var self = this;

      $("#mainVideo").addClass("vjs-waiting");
      var lastTime = self.lastPlaybackTime;
      this.nbPlayerRetryTimeout = setTimeout(function () {

        //self.resetNbPlayerRetryTimeout(false);

        if (self.playbackMetadata.type == "service") {
          console.log("NBPlayer retry playback (after " + delay + " seconds) attempt " + self.nbPlayerAttempts);
          /*nbPlayer.$player.src({
            type: 'application/x-mpegURL',
            src: self.playbackMetadata.url
          });
          */
          self.forcePlayback = true;
          self.playContent(self.playbackMetadata.type, self.playbackMetadata.id, self.playbackMetadata.url, self.playbackMetadata.item, false, true);
          //nbPlayer.$player.play();
        } else if (self.playbackMetadata.type == "vod") {

          self.autoSeek = true;
          /*console.log("NBPlayer retry playback (after " + delay + " seconds) attempt " + self.nbPlayerAttempts);
          nbPlayer.$player.src({
            type: 'application/x-mpegURL',
            src: self.playbackMetadata.url
          });*/
          self.forcePlayback = true;
          self.lastPlaybackTime = lastTime;
          self.playContent(self.playbackMetadata.type, self.playbackMetadata.id, self.playbackMetadata.url, self.playbackMetadata.item, false, true);
          /*if (self.autoSeek && self.lastPlaybackTime > 0) {
            nbPlayer.$player.currentTime(self.lastPlaybackTime);
            self.autoSeek = false;
            self.lastPlaybackTime = 0;
          }*/
          //nbPlayer.$player.play();
        }
        self.nbPlayerAttempts++;
      }, delay * 1000);
    },

    resetNbPlayerRetryTimeout: function (resetAttempts) {
      if (!this.NBPLAYER_RETRY_AFTER_ERROR) { return; }

      if (resetAttempts) {
        this.nbPlayerAttempts = 0;
      }
      if (this.nbPlayerRetryTimeout != null) {
        clearTimeout(this.nbPlayerRetryTimeout);
        this.nbPlayerRetryTimeout = null;
      }
    },

    verifyUserSession: function (forceActivate, callback) {
      if (User.hasCredentialsLicense()) {
        var self = this;
        var license = User.getLicense();
        var pin = User.getLicensePin();
        this.verifyingUserSession = true;
        cv.activateStreamingLicense(license, pin, !forceActivate, function () {
          self.verifyingUserSession = false;
          callback(true);
        }, function () {
          self.verifyingUserSession = false;
          callback(false);
        });
      }
    },

    playEpisode: function (vodId, episodeObject) {
      var vodObject = AppData.getVodObject(vodId);

      if (vodObject != null) {
        var item = JSON.parse(JSON.stringify(vodObject));
        var self = this;

        AppData.getTopLevelVodM3u8Url(episodeObject.id, function (url) {
          console.log("Play vod with URL: " + url);
          if (url != null && url.length > 0) {
            item.currentVodObjectId = vodId;
            item.currentSeasonId = episodeObject.seasonId;
            item.currentEpisodeId = episodeObject.id;
            self.playContent("vod", episodeObject.id, url, item, false, false);
          }
        });
      }
    },

    goOnline: function () {

    },

    goOffline: function () {
      nbPlayer.$player.reset();

      if (nbPlayer.isFullscreen()) {
        this.onReturnFullscreen();
      }

      Router.go("offline");
    },

    destroyScene: function () {
      nbPlayer.$player.reset();
      this.clearData();
      Router.clearHistory();
      Router.go('login');
    },

    playNextCatchup: function (currentEventId) {
      var catchup = AppData.getNextCatchup(currentEventId);
      var self = this;

      if (catchup && catchup != null) {
        AppData.getTopLevelCatchupM3u8Url(catchup.id, function (url) {
          console.log("Play CATCHUP with URL: " + url);
          if (url != null && url.length > 0) {
            self.playContentWithAccess("catchup-event", catchup.eventId, url, catchup, true, false);
          } else {
            nbPlayer.nbPlayerResetContent(true);
            Focus.to(self.$videoContainer);
          }
        });
      } else {
        nbPlayer.nbPlayerResetContent(true);
        Focus.to(this.$videoContainer);
      }
    },

    keyRedAction: function () {
      // go to Home
      var screen = this.getCurrentScreen();

      if (screen == "fullscreen" || screen == "epg" || screen == "vod" || screen == "alertconfirm" || screen == "alertmessage") {
        this.onReturn(Focus.focused, null);
      } else if (screen == "voddetail") {
        var self = this;
        VODDetail.onReturn(function () {
          Focus.to(self.$lastFocused);
          if (self.getCurrentScreen() != "home") {
            self.onReturn(Focus.focused, null);
          }
        });
      }

    },

    keyGreenAction: function () {
      // go to catchups
      this.focusToCatchupRow();
    },

    keyYellowAction: function () {
      // go to VOD
      var screen = this.getCurrentScreen();

      if (screen == "vod") {
        return;
      } if (screen == "fullscreen" || screen == "epg" || screen == "alertconfirm" || screen == "alertmessage") {
        this.onReturn(Focus.focused, null);
      } else if (screen == "voddetail") {
        var self = this;
        VODDetail.onReturn(function () {
          Focus.to(self.$lastFocused);
          self.focusToVodRow();
        });
        return;
      }

      this.focusToVodRow();
    },

    keyBlueAction: function () {
      // go to previous channel played
      this.playLastServiceTVPlayed();
    },

    getCurrentScreen: function () {
      if (!this.isActive) {
        return "";
      }

      var $el = Focus.focused;
      if (nbPlayer.isFullscreen()) {
        return "fullscreen";
      } else if (EPG.isShowed()) {
        return "epg";
      } else if (VOD.isShowed() && !VODDetail.isShowed()) {
        return "vod"
      } else if (VODDetail.isShowed()) {
        return "voddetail";
      } else if ($el.isInAlertConfirm(this.$el)) {
        return "alertconfirm";
      } else if ($el.isInAlertMessage(this.$el)) {
        return "alertmessage";
      } else {
        return "home";
      }
    },

    focusToCatchupRow: function () {
      var $catchupsRow = $("#catchupsRow");
      if ($catchupsRow.is(":visible")) {
        var $focusTo = $catchupsRow.find(".focusable:first");
        if ($focusTo != null && $focusTo.length > 0) {
          this.channelsGrid.scrollTop(this.channelsGrid.scrollTop() + $catchupsRow.position().top);
          Focus.to($focusTo);
        }
      }
    },

    focusToVodRow: function () {
      var $row = $("#vodRow");
      if ($row.is(":visible")) {
        var $focusTo = $row.find(".focusable:first");
        if ($focusTo != null && $focusTo.length > 0) {
          this.channelsGrid.scrollTop(this.channelsGrid.scrollTop() + $row.position().top);
          Focus.to($focusTo);
        }
      }
    },

    keyNumberAction: function (number) {
      if (this.playbackMetadata && this.playbackMetadata.type != "service") {
        return;
      }

      var $focused = Focus.focused;
      if ($focused.isInAlertInput(this.$el)) {
        return;
      }

      var label = $(".channel-number-indicator").find("span:first");
      var newChannelNumber = Number(label.text() + number) || 0;
      label.html(newChannelNumber);
      label.show();

      var self = this;
      clearInterval(this.changeChannelTimer);
      this.changeChannelTimer = setTimeout(function () {
        self.changeChannelByNumber(newChannelNumber);
      }, self.changeChannelWait);
    },

    changeChannelByNumber: function (number) {
      $(".channel-number-indicator").find("span:first").empty();
      $(".channel-number-indicator").find("span:first").hide();

      var channel = AppData.getServiceTVByChannelNumber(number);
      if (channel != false) {
        this.playServiceTVByChannel(channel);
      }
    },

    updateStepLoad: function (step) {
      console.log("StepLoad changed from " + this.stepLoad + " to " + step);
      this.stepLoad = step;
    },

    openEPG: function () {
      if (this.stepLoad > 3) {
        EPG.show();
      } else {
        this.$el.showAlertMessage(__("EPGLoadingPleaseWait"), "epgloading", __("SettingsOkButton").toUpperCase());
      }
    },

    checkParentalControl: function (type, id, url, item, reset, forceFullscreen) {
      var self = this;
      var requirePin = false;
      if (type == "service" && ((typeof item.parentalControl != 'undefined' && item.parentalControl) || User.hasServiceTVLocked(id))) {
        requirePin = true;
      } else if (type == "catchup-event" && item.catchupGroupId) {
        var serviceTV = AppData.getServiceTVByCatchupObj(item);
        if (serviceTV.parentalControl || User.hasServiceTVLocked(serviceTV.id)) {
          requirePin = true;
        }
      }

      if (requirePin) {
        this.$lastFocused = Focus.focused;
        var $container = nbPlayer.isFullscreen() ? nbPlayer.$mainVideo : $(".common:first");
        ParentalControlDlg.show($container, this.$lastFocused, function () {
          self.playContent(type, id, url, item, reset, false);
        }, function() {
          self.resetPlayerContent(false, __("ChannelBlocked").replace("%s", item.name), type, item);
        });
      } else {
        this.playContent(type, id, url, item, reset, false);
        if (forceFullscreen) {
          this.goToFullscreen();
        }
      }

    },

  });

  return Scene_Home;

})(Scene);
