$(document).ready(function(){
    $(".main-header .sidebar-toggle").click(function(){
      if($(window).width()>768)
        $("body").toggleClass("sidebar-mini sidebar-collapse");
      else
        $("body").toggleClass("sidebar-mini sidebar-open");
    });
    $(".sidebar-menu .treeview > a").click(function(){
      // if(!$(this).hasClass("treeview-menu")){
        if(!$("body").hasClass("sidebar-collapse") ||$("body").hasClass("sidebar-open") ){
          $(this).closest('li').toggleClass("menu-open");
          $(this).closest('li').children(".treeview-menu").slideToggle();
          $(this).closest('li').siblings().each(function(){
            $(this).children(".treeview-menu").slideUp();
            $(this).removeClass("menu-open");
          });
          setTimeout(function(){
            $(".sidebar-mini .content-wrapper").css({'min-height': $(".main-sidebar .sidebar").outerHeight() + 50+  'px'});
            console.log("resize height: " + $(".main-sidebar .sidebar").outerHeight());
          }, 500);
        }
      // }
    });
    // new ResizeSensor(jQuery('.main-sidebar .sidebar'), function(){
    //   $(".sidebar-mini .content-wrapper").css({'min-height': $(".main-sidebar .sidebar").outerHeight() + 50 + 'px'});
    //   console.log("resize height: " + $(".main-sidebar .sidebar").outerHeight());
    // });
    // $(".main-sidebar .sidebar").resize(function(){
    //   $(".sidebar-mini .content-wrapper").css({'min-height': $(".main-sidebar .sidebar").outerHeight() + 50 + 'px'});
    //   console.log("resize height: " + $(".main-sidebar .sidebar").outerHeight());
    // });
    $(".sidebar-mini .content-wrapper").css({'min-height': $(".main-sidebar .sidebar").outerHeight() + 50 + 'px'});
    console.log($(document).outerHeight());
    $(".box-header .btn-minus").click(function(){
      $(this).closest('.box').find(".box-body").slideToggle();
      $(this).closest('.box').find(".box-footer").slideToggle();
      console.log("I am clicked!");
    });
});
