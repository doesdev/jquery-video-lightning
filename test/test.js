(function ($) {

    test("empty", function () {
      equal(1, 1, "1 equals 1");
    });
//    test("options", function () {
//        ok($.fn.jqueryVideoLightning.settings(), "options set up correctly");
//        equal($.fn.jqueryVideoLightning.settings().videoId, "y-dQw4w9WgXcQ", "default video id is set properly");
//    });
//
//    test("defaults", function () {
//        ok($('.test-target').jqueryVideoLightning().settings(), "options set up correctly");
//        equal($('.test-target').jqueryVideoLightning().settings().videoId, "y-dQw4w9WgXcQ", "default video id is set properly");
//    });

    test("chainable", function () {
        ok($('.test-target').jqueryVideoLightning().addClass("testing"), "can be chained");
        equal($('.test-target').attr("class"), "test-target testing", "class was added correctly from chaining");
    });

})(jQuery);