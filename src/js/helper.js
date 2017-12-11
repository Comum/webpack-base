(function (global) {

    let buttonClicked = () => {
        alert('I was clicked');
    };

    $('.js-button').on('click', buttonClicked);
}(window));