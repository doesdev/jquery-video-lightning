(function ($) {

    test("This is your first test", function () {
        ok($.fn.jqueryVideoLightning.options, "options set up correctly");
    });

    test("chainable", function () {
        ok($('.test-target').jqueryVideoLightning().addClass("testing"), "can be chained");
        equal($('.test-target').attr("class"), "test-target testing", "class was added correctly from chaining");
    });

})(jQuery);