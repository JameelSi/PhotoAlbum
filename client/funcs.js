function getListOfAlbums() {
    $.ajax("/albums", {
        datatype: "json",
        cache: false,
        success: function (data, status, xhr) {
            $("#albums tbody").empty();
            $.each(data, function (key, val) {
                var tblRow = `
                    <tr>
                        <th colspan="5">
                            <hr>
                        </th>
                    </tr>
                    <tr class="${key}">
                        <td class="column">${val.name}</td>
                        <td class="column">${key}</td>
                        <td class="column">${val.type}</td>
                        <td>
                            <button onclick="getListOfPhotos(${key})" type="button">
                                View Album
                            </button>
                        </td>
                        <td>
                            <button onclick="openPicForm(${key})" type="button">
                                Add photos
                            </button>
                        </td>
                        <td>
                            <button onclick="deleteAlbum(${key})" type="button">
                                Delete Album
                            </button>
                        </td>
                    </tr>
                    <tr class="imgs" ><td colspan='6' id="${key}"></td></tr>
                    `;

                $(tblRow).appendTo("#albums tbody");
            })
        },
        error: function (jqXHR) {
            alert(jqXHR.status, ': Error fetching data, please try again later')
        }
    });
}

$(document).ready(getListOfAlbums);


function submitPicForm(form, event) {
    let albumId = $("#albumId").attr("title")
    const data = {};
    $(form).serializeArray().forEach(e => data[e.name] = e.value);
    event.preventDefault();
    createPhotoInAlbum(albumId, data.photoName, data.artistName, data.link);
    closePicForm();
}

function createPhotoInAlbum(albumId, photoName, artistName, link) {
    $.post("/photo", {
        albumId, photoName, artistName, link
    })
        .done(function (data) {
            getListOfPhotos(albumId)
            console.log(data);
        })
        .fail(function (xhr, status, error) {
            alert(xhr.responseText)
        })
}

function submitAlbumForm(form, event) {
    const data = {};
    $(form).serializeArray().forEach(e => data[e.name] = e.value);
    event.preventDefault();
    createAlbum(data.albumName, data.albumCategory);
    closeAlbumForm();
}

function createAlbum(albumName, albumCategory) {
    $.post("/albums", { albumName, albumCategory })
        .done(function (data) {
            console.log(data);
            getListOfAlbums();
        })
        .fail(function (xhr, status, error) {
            alert(xhr.responseText)
        })
}

function deleteAlbum(albumId) {
    if (confirm(`Delete album ${albumId}?`)) {
        $.ajax(`/albums/${albumId}`, {
            type: 'Delete',
            success: function () {
                getListOfAlbums()
            },
            error: function (jqXHR) {
                alert(jqXHR.status, ': Error deleting album, please try again later')
            }
        })
    }
}
//get the data and build the html structure 
function getListOfPhotos(albumId) {
    $.ajax(`/albums/${albumId}`, {
        datatype: "json",
        cache: false,
        success: function (data, status, xhr) {
            $(`#${albumId}`).empty();
            $.each(data, function (key, val) {

                var tblRow = `                
                <div class="responsive">
                <div class="gallery">
                <img src="${val.link}"  onerror='this.src="../data/imgs/wrong-link.jpg"' alt="${val.name}" width="600" height="400">
                <div class="desc">Photo by: ${val.photographer}<br>Name: ${val.name}</div>
              </div>
              </div>
              `;
                $(tblRow).appendTo(`#${albumId}`)
            })
        }
    });
}
//open the album form 
function openAlbumForm() {
    $("#albumFormDiv").show();
}
//close the album form 
function closeAlbumForm() {
    $("#albumFormDiv").hide();
}

function openPicForm(albumId) {
    $("#albumId").replaceWith(`<h1 id="albumId" title="${albumId}">Add a picture to album ${albumId}</h1>`);
    $("#albumFormDiv").hide();
    $("#picFormDiv").show();

}

function closePicForm() {
    $("#picFormDiv").hide();
}