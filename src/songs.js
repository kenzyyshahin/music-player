const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;

const songs = [
  {
    id: 1,
    title: "Rengarenk Ormanlar",
    artist: "Çağan Şengül & Işıl Ayman",
    cover: publicAsset("covers/rengarenk-ormanlar.jpg"),
    audio: publicAsset("songs/Çağan Şengül - Rengarenk Ormanlar (4).mp3"),
  },
  {
    id: 2,
    title: "Fairytale",
    artist: "Alexander Rybak",
    cover: publicAsset("covers/fairytale.png"),
    audio: publicAsset(
      "songs/Alexander Rybak - Fairytale (128  kbps) (shabakngy.com) (1).mp3",
    ),
  },
  {
    id: 3,
    title: "Çift Gökkuşağı",
    artist: "Buray",
    cover: publicAsset("covers/cift-gokkusagi.png"),
    audio: publicAsset(
      "songs/Buray_Çift_Gökkuşağı_Ada_Masalı_Orijinal_Dizi_Müziği_1.mp3",
    ),
  },
  {
    id: 4,
    title: "Memories",
    artist: "Maroon 5",
    cover: publicAsset("covers/memories.png"),
    audio: publicAsset(
      "songs/Maroon_5_Memories_Official_Video_192_kbpsabdwap2_com_1.mp3",
    ),
  },
  {
    id: 5,
    title: "If I Can't Have You",
    artist: "Shawn Mendes",
    cover: publicAsset("covers/if-i-cant-have-you.jpg"),
    audio: publicAsset("songs/Shawn_Mendes-If_I_Can't_Have_You.mp3"),
  },
  {
    id: 6,
    title: "Let Me Love You",
    artist: "DJ Snake ft. Justin Bieber",
    cover: publicAsset("covers/let-me-love-you.jpg"),
    audio: publicAsset("songs/let-me-love-you-dj-snake.mp3"),
  },
];

export default songs;
