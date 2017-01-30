function SongPlaylist() {
    this.playlist = null;

    this.init = function () {
        this.playlist = WaveformPlaylist.init({
            samplesPerPixel: 1000,
            waveHeight: 100,
            container: document.getElementById("playlist"),
            timescale: true,
            state: 'cursor',
            colors: {
                waveOutlineColor: '#E0EFF1'
            },
            controls: {
                show: true,
                width: 200
            },
            zoomLevels: [500, 1000, 3000, 5000],
            exclSolo: true //enabling exclusive solo
        });
        this.addEventEmitter();
    };

    this.load = function (data) {
        this.songModel = new SongModel(data);

        this.playlist.load(this.songModel.getTracks()).then(function () {

        });
    }
}



