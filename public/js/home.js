var mainDiv = document.getElementById("container");


function fadeOut(event) {
    var fadeTarget = mainDiv;
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            mainDiv.remove();
            photos.length--;

        }
    }, 200)
}

function createPhotoCard(data, containerDiv) {
    let div = document.createElement('div');
    let img = document.createElement('img');
    let title = document.createElement('p');
    div.setAttribute('class', 'photo-class');
    title = data.title;
    img.src = data.url;
    img.width = "200";
    img.height = "200";
    div.append(img, title);
    containerDiv.append(div);
}

if (mainDiv) {
    let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
    fetch(fetchURL)
    .then((data) => data.json())
    .then((photos) => {
        let innerHTML = "";
        photos.forEach((photo) => {
            createPhotoCard(photo, mainDiv);
        });
        document.getElementById('item-count').innerHTML = `There are ${photos.length} photo(s) being shown`;
    })
}

mainDiv.addEventListener('click', fadeOut);

