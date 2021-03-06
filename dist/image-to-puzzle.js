'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var input = document.querySelector('input'),
    canvas = document.querySelector('canvas'),
    c = canvas.getContext('2d'),
    image = new Image(),
    select = document.querySelector('select'),
    restart = document.querySelector('button');

var shuffle = function shuffle(array) {
  var j, x, i;
  for (i = array.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = array[i - 1];
    array[i - 1] = array[j];
    array[j] = x;
  }
  return array;
};

var maps = [],
    k = 0,
    t = 0,
    lock = select.value,
    rand_x = Math.floor(Math.random() * lock),
    rand_y = Math.floor(Math.random() * lock);

// reset
var reset = function reset(lock) {
  maps = [];
  k = 0;
  t = 0;
  rand_x = Math.floor(Math.random() * lock);
  rand_y = Math.floor(Math.random() * lock);

  for (var i = 0; i < lock; i++) {
    var _ = [];
    for (var j = 0; j < lock; j++) {
      if (i != rand_x || j != rand_y) _.push({
        x: i,
        y: j,
        t: t
      });else _.push(t);

      t++;
    }
    maps.push(shuffle(_));
  }

  maps = shuffle(maps);

  image.src = input.value;
  image.onload = function (_) {

    canvas.width = image.width;
    canvas.height = image.height;

    var w = image.width / lock,
        h = image.height / lock;

    maps.forEach(function (map, i) {
      map.forEach(function (_, j) {
        if (typeof maps[i][j] != "number") c.drawImage(image, w * maps[i][j].x, h * maps[i][j].y, w, h, w * i, h * j, w, h);
      });
    });
  };
};

// reset
select.addEventListener('change', function (e) {
  return reset(select.value);
});

input.addEventListener('change', function (e) {
  return reset(select.value);
});

restart.addEventListener('click', function (e) {
  return reset(select.value);
});

// canvas click
canvas.addEventListener('click', function (e) {
  var x = e.clientX - 8,
      y = e.clientY - 8,
      dx = 0,
      dy = 0,
      lock = select.value;

  var w = image.width / lock,
      h = image.height / lock;

  while (x > image.width / lock) {
    x -= image.width / lock;
    dx++;
  }

  while (y > image.height / lock) {
    y -= image.height / lock;
    dy++;
  }

  try {
    if (typeof maps[dx][(dy + 1) % lock == 0 ? lock - 1 : (dy + 1) % lock] == "number") {
      var _ = maps[dx][(dy + 1) % lock == 0 ? lock - 1 : (dy + 1) % lock];
      maps[dx][(dy + 1) % lock == 0 ? lock - 1 : (dy + 1) % lock] = maps[dx][dy];
      maps[dx][dy] = _;
    } else if (typeof maps[dx][(dy - 1) % lock] == "number") {
      var _2 = maps[dx][(dy - 1) % lock];
      maps[dx][(dy - 1) % lock] = maps[dx][dy];
      maps[dx][dy] = _2;
    } else if (typeof maps[(dx + 1) % lock == 0 ? lock - 1 : (dx + 1) % lock][dy] == "number") {
      var _3 = maps[(dx + 1) % lock == 0 ? lock - 1 : (dx + 1) % lock][dy];
      maps[(dx + 1) % lock == 0 ? lock - 1 : (dx + 1) % lock][dy] = maps[dx][dy];
      maps[dx][dy] = _3;
    } else if (typeof maps[(dx - 1) % lock][dy] == "number") {
      var _4 = maps[(dx - 1) % lock][dy];
      maps[(dx - 1) % lock][dy] = maps[dx][dy];
      maps[dx][dy] = _4;
    }
  } catch (e) {}

  c.clearRect(0, 0, image.width, image.height);

  maps.forEach(function (map, i) {
    map.forEach(function (_, j) {
      if (typeof maps[i][j] != "number") c.drawImage(image, w * maps[i][j].x, h * maps[i][j].y, w, h, w * i, h * j, w, h);
    });
  });

  var isImage = [];

  maps.forEach(function (map, i) {
    map.forEach(function (_, j) {
      isImage.push(_typeof(maps[i][j]) == "object" ? maps[i][j].t : maps[i][j]);
    });
  });

  if (isImage.toString() == isImage.sort().toString()) {
    (function () {
      var i = 0;
      var interval = setInterval(function () {
        c.clearRect(0, 0, image.width, image.height);
        c.globalAlpha = i;
        c.drawImage(image, 0, 0);
        i += 0.1;

        if (i > 1) clearInterval(interval);
      }, 100);
    })();
  }
});