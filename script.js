$(document).ready(function () {
    /* ======================================================================
       BONUS CONTROL: Star Wars Font Switcher (FontSpace Collection Fonts)
       ====================================================================== */
    $('#font-selector').on('change', function () {
        const selectedFont = $(this).val();
        $(':root').css('--sw-font', selectedFont);
    });

    /* ======================================================================
       JQUERY ELEMENT #1: Opening Crawl Toggle & Replay
       Methods used: .slideToggle(), .text(), .css(), .fadeOut(), .fadeIn()
       ====================================================================== */
    $('#toggle-crawl-btn').on('click', function () {
        const $btn = $(this);
        $('#crawl-viewport').slideToggle(500, function () {
            const isVisible = $(this).is(':visible');
            $btn.text(isVisible ? 'Hide Opening Crawl' : 'Show Opening Crawl');
        });
    });

    $('#replay-crawl-btn').on('click', function () {
        const $crawl = $('#crawl-content');
        const $viewport = $('#crawl-viewport');

        // Ensure viewport is visible first
        if (!$viewport.is(':visible')) {
            $viewport.slideDown(300);
            $('#toggle-crawl-btn').text('Hide Opening Crawl');
        }

        // Restart CSS animation using jQuery fade & style reset
        $crawl.fadeOut(150, function () {
            $crawl.css('animation', 'none');
            // Trigger reflow
            void $crawl[0].offsetWidth;
            $crawl.css('animation', 'starWarsCrawl 28s linear infinite');
            $crawl.fadeIn(250);
        });
    });

    /* ======================================================================
       JQUERY ELEMENT #2: Holocron Motivational Quote Generator
       Methods used: .fadeOut(), .fadeIn(), .text(), .css()
       ====================================================================== */
    const quotes = [
        {
            text: '"Do. Or do not. There is no try — Commit 100% to your daily learning habits."',
            author: '— Grand Master Yoda (Mindset Principle #1)',
            category: 'Execution & Focus',
            color: '#00E5FF'
        },
        {
            text: '"The greatest teacher, failure is — Every bug, rejection, and setback builds seniority."',
            author: '— Grand Master Yoda (Growth Principle #2)',
            category: 'Resilience & Growth',
            color: '#00FF66'
        },
        {
            text: '"Your focus determines your reality — Guard your deep-work hours from distraction."',
            author: '— Qui-Gon Jinn (Productivity Principle #3)',
            category: 'Deep Work',
            color: '#FFE81F'
        },
        {
            text: '"Never tell me the odds! — Apply for the ambitious role and build the bold project."',
            author: '— Han Solo (Courage Principle #4)',
            category: 'Career Courage',
            color: '#C74BFF'
        },
        {
            text: '"Always pass on what you have learned — True career mastery is lifting up your peers."',
            author: '— Master Yoda (Leadership Principle #5)',
            category: 'Mentorship',
            color: '#00E5FF'
        },
        {
            text: '"In my experience, there is no such thing as luck — Preparation meets opportunity."',
            author: '— Obi-Wan Kenobi (Preparation Principle #6)',
            category: 'Discipline',
            color: '#00FF66'
        }
    ];

    let currentQuoteIndex = 0;

    $('#next-quote-btn').on('click', function () {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        const nextQuote = quotes[currentQuoteIndex];

        $('#holocron-box').fadeOut(250, function () {
            $('#quote-text').text(nextQuote.text);
            $('#quote-author').text(nextQuote.author);
            $('#quote-category')
                .text(nextQuote.category)
                .css('color', nextQuote.color);
            $('#holocron-box').css('border-left-color', nextQuote.color);
            $('#quote-counter').text(`Holocron ${currentQuoteIndex + 1} of ${quotes.length}`);
        }).fadeIn(300);
    });

    /* ======================================================================
       JQUERY ELEMENT #3: Jedi Career Rank Accordion Roadmap
       Methods used: .slideUp(), .slideDown(), .closest(), .siblings(), .find()
       ====================================================================== */
    $('.accordion-header').on('click', function () {
        const $item = $(this).closest('.accordion-item');
        const $body = $item.find('.accordion-body');
        const isAlreadyOpen = $item.hasClass('active');

        // Collapse all other accordion items
        $item.siblings('.accordion-item').removeClass('active')
            .find('.accordion-body').slideUp(300);
        $item.siblings('.accordion-item')
            .find('.accordion-icon').html('+');

        // Toggle clicked item
        if (isAlreadyOpen) {
            $item.removeClass('active');
            $body.slideUp(300);
            $(this).find('.accordion-icon').html('+');
        } else {
            $item.addClass('active');
            $body.slideDown(300);
            $(this).find('.accordion-icon').html('&minus;');
        }
    });

    /* ======================================================================
       JQUERY ELEMENT #4: Lightsaber Skill & Habit Progress Animator
       Methods used: .animate(), .attr(), .find(), .each()
       ====================================================================== */
    function updateSkillRow($row, newProgress) {
        const clamped = Math.min(100, Math.max(10, newProgress));
        $row.attr('data-progress', clamped);

        // Animate the lightsaber blade width smoothly using jQuery .animate()
        $row.find('.saber-blade').stop(true).animate(
            { width: clamped + '%' },
            500
        );

        const label = clamped === 100 ? '100% (MASTERED!)' : clamped + '%';
        $row.find('.skill-percent').text(label);
    }

    $('.train-btn').on('click', function () {
        const $row = $(this).closest('.skill-row');
        const current = parseInt($row.attr('data-progress'), 10) || 0;
        updateSkillRow($row, current + 20);
    });

    $('#boost-all-btn').on('click', function () {
        $('.skill-row').each(function () {
            updateSkillRow($(this), 100);
        });
    });

    $('#reset-skills-btn').on('click', function () {
        const defaults = [40, 60, 20, 80];
        $('.skill-row').each(function (index) {
            updateSkillRow($(this), defaults[index] || 20);
        });
    });

    /* ======================================================================
       JQUERY ELEMENT #5: Interactive Career Mission Log (DOM Manipulation)
       Methods used: .append(), .on(), .toggleClass(), .fadeOut(), .remove()
       ====================================================================== */
    function updateMissionStats() {
        const activeCount = $('#mission-list .mission-item:not(.completed)').length;
        const suffix = activeCount === 1 ? 'active mission remaining' : 'active missions remaining';
        $('#mission-stats').text(`${activeCount} ${suffix}`);
    }

    // Add a new mission item dynamically
    $('#mission-form').on('submit', function (event) {
        event.preventDefault();
        const missionTitle = $('#mission-input').val().trim();
        if (!missionTitle) return;

        const $newItem = $(`
            <li class="mission-item" style="display: none;">
                <span class="mission-check">&#9734;</span>
                <span class="mission-text"></span>
                <button class="delete-mission-btn" title="Remove Mission">&times;</button>
            </li>
        `);

        // Safely set text to prevent XSS
        $newItem.find('.mission-text').text(missionTitle);

        $('#mission-list').append($newItem);
        $newItem.fadeIn(300);
        $('#mission-input').val('');
        updateMissionStats();
    });

    // Event delegation: Toggle completed state on click
    $('#mission-list').on('click', '.mission-item', function (event) {
        if ($(event.target).hasClass('delete-mission-btn')) return;

        $(this).toggleClass('completed');
        const isCompleted = $(this).hasClass('completed');
        $(this).find('.mission-check').html(isCompleted ? '&#9733;' : '&#9734;');
        updateMissionStats();
    });

    // Event delegation: Delete a single mission with fadeOut
    $('#mission-list').on('click', '.delete-mission-btn', function (event) {
        event.stopPropagation();
        $(this).closest('.mission-item').fadeOut(250, function () {
            $(this).remove();
            updateMissionStats();
        });
    });

    // Clear all completed missions
    $('#clear-completed-btn').on('click', function () {
        $('#mission-list .mission-item.completed').fadeOut(300, function () {
            $(this).remove();
            updateMissionStats();
        });
    });
});
