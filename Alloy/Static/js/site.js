
$(document).ready(function () {
    
    /* Blocks within containers with an 'equal-height' class should all have the same height */
    var eqH = function () {

        $(".equal-height").each(function () {

            var elements = $(this).find(".border");

            // reset height style
            elements.css({ "min-height": "" });

            // exit if one or less elements
            if (elements.length < 2) {
                return;
            }

            var minHeight = 0;
            var inLine = true;
            var top = elements.eq(0).position().top;
            var i = 1;

            // check that all items have the same top position
            while (inLine && i < elements.length) {
                inLine = (elements.eq(i).position().top === top);
                i++;
            }

            // don't style when items are wrapped
            if (!inLine) {
                return;
            }

            // get min height
            elements.each(function () {
                var h = $(this).height();
                if (h > minHeight) {
                    minHeight = h;
                }
            });

            // style elements
            elements.css({ "min-height": minHeight });
        });
    };

    $(window).load(eqH).resize(eqH);
});