const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Util = imports.misc.util;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Icons = Me.imports.icons;

let text, button, icon, state

// To Debug -> journalctl /usr/lib/gnome-session/gnome-session-binary -f -o cat

function _hideEnableCuda() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showEnableCuda() {
    if (!text) {
        text = new St.Label({ style_class: 'enable-cuda-label', text: "" });
        Main.uiGroup.add_actor(text);
    }

    if (!state) {
        Util.spawnCommandLine("sudo prime-select nvidia");
        text.text = "NVIDIA Enabled";
        text.style_class = 'enable-cuda-label enabled';
        icon.style_class = 'system-status-icon enabled';
        state = true;
        global.log('NVIDIA Enabled');
    } else {
        Util.spawnCommandLine("sudo prime-select intel");
        text.text = "NVIDIA Disabled";
        text.style_class = 'enable-cuda-label';
        icon.style_class = 'system-status-icon';
        state = false;
        global.log('NVIDIA Disabled');
    }     

    text.opacity = 255;
    let monitor = Main.layoutManager.primaryMonitor;
    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 3,
                       transition: 'easeOutQuad',
                       onComplete: _hideEnableCuda });
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    Icons.init();

    state = false;
    icon = new St.Icon({ icon_name: 'prime-menu-default-symbolic',
                         style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _showEnableCuda);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
