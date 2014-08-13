// json to hold all the events loaded on trading page
var trade_event_bindings = {};

function contract_guide_popup() {
    $('#bet_guide_content').on('click', 'a.bet_demo_link', function (e){
        e.preventDefault();
        var ip = new InPagePopup();
        ip.ajax_conf = { url: this.href, data: 'ajax_only=1' };
        ip.fetch_remote_content(true, '', function (data) {
            attach_tabs('#contract_demo_container');
            return data;
        });
    });
}

var trading_times_init = function() {
      var tabset_name = "#trading-tabs";

     var trading_times = $(tabset_name);
     trading_times.tabs();
     var url = location.href;
     $( "#tradingdate" ).datepicker({ minDate: 0, maxDate:'+1y', dateFormat: "yy-mm-dd", autoSize: true,
     onSelect: function( dateText, picker ){
         trading_times.tabs( "destroy" );
         showLoadingImage(trading_times);
         url = page.url.url_for('trading_times.cgi', 'date=' + dateText, 'cached');
         $.ajax({
                  url: url,
                  data:  { 'ajax_only': 1 },
                  success: function(html){
                            trading_times.replaceWith(html);
                            trading_times = $("#trading-tabs");
                            trading_times.tabs();
                            page.url.update(url);
                         },
                  error: function(xhr, textStatus, errorThrown){
                          trading_times.empty().append(textStatus);
                       },
                });
         }
     });
};

var asset_index_init = function() {
    var tabset_name = "#asset-tabs";
    // jQueryUI tabs
    $(tabset_name).tabs();
};

function confirm_popup_action() {
    SpotLight.attach_click_event('a.tm-a-2', function (e){
        e.preventDefault();
        $(this).parents('#bom-confirm-popup').find('a.tm-a-2').removeClass('a-active').end().end().addClass('a-active');
        $('#'+this.id+'-content').siblings('div.rbox-content').addClass('invisible').end().removeClass('invisible');
    });

    $('.bom_confirm_popup_link').on('click', function (e){
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: this.href,
            data: 'ajax_only=1',
            success: function (html) {
                SpotLight.set_content(html);
                SpotLight.show();
            }
        });
    });
}

var hide_payment_agents = function() {
    var language = page.language();
    if(language == 'JA') {
        $('.payment_agent_methods').addClass('invisible');
    }
};

function get_login_page_url() {
    var params = '';
    try {
        var lang = page.language();
        if (!lang) {
            throw new Error("failed to detect page language");
        }
        params += '?l=' + lang;
    } catch (e) {
        console.log("error while getting page language. " + e);
    }
    return 'https://' + page.settings.get('domains')['private'] + '/login' + params;
}

onLoad.queue_for_url(contract_guide_popup, 'contract_guide');
onLoad.queue_for_url(trading_times_init, 'trading_times');
onLoad.queue_for_url(asset_index_init, 'asset_index');
onLoad.queue_for_url(confirm_popup_action, 'my_account|confirm_popup');
onLoad.queue_for_url(hide_payment_agents, 'available_payment_methods');

onLoad.queue_for_url(function() {
    $('div.further-info')
    .children('div').hide().end()
    .children('a').click(function() {
        $(this).siblings('div').toggle();
        return false;
    });
}, '/c/paymentagent_list');

onLoad.queue_for_url(function() {
    $('#runbet_tickbrain_criteria_form').find('select[name="whattodo"]').change(function() {
        var whattodo = $(this).val();
        var disabled = '';
        if ($(this).val() == 'list') {
            disabled = 'disabled';
        }
        $('select#lastn > option').each(function() {
            var number_ticks = $(this).val();
            if (number_ticks > 1000) {
                $(this).attr('disabled', disabled);
            }
        });
    });
}, 'runbet_tickbrain');
