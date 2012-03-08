YUI().add('tokens', function(Y) {

    Y.one('#buyTokensPanel').setStyle('display', 'block');
    var panel = new Y.Panel({
        srcNode      : '#buyTokensPanel',
        headerContent: 'Tokens',
        width        : 400,
        zIndex       : 5,
        centered     : true,
        modal        : true,
        visible      : false,
        render       : true,
        plugins      : [Y.Plugin.Drag]
    });

    panel.addButton({
        value  : '&nbsp;Buy',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            buyTokens();
        },
        classNames: 'icon-plus'
    });

    function buyTokens() {
        var tokens = Y.one('#tokens').get('value')
        ;

        panel.hide();
        Y.Global.Hub.fire(
            'user:buyTokens'
            , { tokens: tokens }
            , function(err, tokens) {
                if (err) {
                    Y.Global.Hub.fire('ui:error', { message: err } );
                } else {
                    Y.one('#user_tokens').set('innerHTML', tokens);
                }
            }
        );
    }

    Y.Global.Hub.on('buy_tokens', function() {
        panel.show();
    });

}, '1.0', { requires: [ 'node', 'panel', 'dd-plugin' ] } );
