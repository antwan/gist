function updateFilterSieve() {
    var filters = [];
    $("[type='checkbox'][id^='merchant']").each(function() {
        if($(this).is(':checked')) {
            filters.push($(this).data('filterSieve'));
        }
    })
    $("pre").html(`if anyof(\n  ${filters.join(",\n  ")}\n) {\n  redirect :copy "handle@domain"\n}`);
}

function toggleMode(e) {
    let outputFunction = e.target.checked ? updateFilterSieve : updateFilter;
    $("[type='checkbox'][id^='merchant']").off('change');
    $("[type='checkbox'][id^='merchant']").on('change', outputFunction);
    $("pre").toggleClass("text-center", !e.target.checked);
    outputFunction();
}

function transformRules() {
    $("[type='checkbox'][id^='merchant']").each(function() {
        let senderSubjectRule = $(this).data('filter').match(/^\(from:\((.*)\) "(.*)"\)$/);
        let subjectRule = $(this).data('filter').match(/^\("(.*)"\)$/);
        $(this).data('filterSieve',
            senderSubjectRule ?
                `allof(\n    header :contains "From" "${senderSubjectRule[1]}",\n` +
                `    header :contains "Subject" "${senderSubjectRule[2]}"\n  )`
            : subjectRule ?
                `header :contains "Subject" "${subjectRule[1]}"`
            : '');
    });
}

function addSieve(){
    transformRules();
    $('h1.mb-1').html('\
        <span>Gmail</span>\
        <span class="custom-switch" style="height: 32px; vertical-align: middle; display: inline-block; margin-left: 12px">\
            <input type="checkbox" class="custom-control-input" id="sieve-switcher">\
            <label class="custom-control-label" for="sieve-switcher"></label>\
        </span>\
        <span>Sieve</span>\
    ');
    $('#sieve-switcher').on('change', toggleMode);
}
addSieve()
