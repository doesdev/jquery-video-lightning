(function ($, window, document) {

    function fontScaling(font_factor) {
        var calculate_font, font_size;
        calculate_font = Math.abs(100 - $(window).outerWidth() / 10) + 100;
        font_size = (calculate_font < font_factor) ? calculate_font : font_factor;
        $('body').css("font-size", font_size + "%");
    }

    function sizing() {
        if ($(window).outerWidth() < 750) {
            $(".box").css({
                "margin": "20px 5%",
                "width": "90%"
            });
            fontScaling(90);
        } else {
            $(".box").css({
                "margin": "20px 20%",
                "width": "60%"
            });
            fontScaling(125);
        }
    }

    $(window).on("resize", function () {
        sizing();
    });

    $(document).ready(function () {
        sizing();
    });

})(jQuery, window, document);