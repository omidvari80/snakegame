const GAME_SPEED = 100;
        const CANVAS_BORDER_COLOUR = 'black';
        const CANVAS_BACKGROUND_COLOUR = "slateblue";
        const SNAKE_COLOUR = 'violet';
        const SNAKE_BORDER_COLOUR = 'slateblue';
        const FOOD_COLOUR = 'tomato';
        const FOOD_BORDER_COLOUR = 'darkred';
        //تعریف مختصات مار در پالت بازی 
        let snake = [
          {x: 150, y: 150},
          {x: 140, y: 150},
          {x: 130, y: 150},
          {x: 120, y: 150},
          {x: 110, y: 150}
        ]
        //امتیاز کاربر
        let score = 0;
        //وقتی روی true تنظیم شود، مار در حال تغییر جهت است
        let changingDirection = false;
        //غذا X-Coordinate
        let foodX;
       //غذا y-Coordinate
        let foodY;
        //سرعت افقی
        let dx = 10;
       //سرعت عمودی 
        let dy = 0;
       //یافتن پالت و ذخیره سازی 
        const gameCanvas = document.getElementById("gameCanvas");
        //دوبعدی کردن بازی 
        const ctx = gameCanvas.getContext("2d");
        // شروع بازی 
        main();
        // ایجاد اولین غدا
        createFood();
        // برای اتصال کیبورد به بازی 
        document.addEventListener("keydown", changeDirection);
        //عملکرد اصلی بازی
        function main() {
          //اگر بازی زود تمام شد برای توقف بازی برگردید
          if (didGameEnd()) return;
          setTimeout(function onTick() {
            changingDirection = false;
            clearCanvas();
            drawFood();
            advanceSnake();
            drawSnake();
            //دوباره به بازی زنگ بزن
            main();
          }, GAME_SPEED)
        }
        // رنگ پس زمینه بوم را به CANVAS BACKGROUND COLOR تغییر دهید و اطراف آن را یک حاشیه بکشید.
        function clearCanvas() {
         // رنگ را برای پر کردن نقاشی انتخاب کنید
          ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
          // رنگ حاشیه بوم را انتخاب کنید
          ctx.strokestyle = CANVAS_BORDER_COLOUR;
          // یک مستطیل "پر" بکشید تا کل بوم را بپوشاند
          ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
          // یک "حاشیه" در اطراف کل بوم بکشید
          ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
        }
        // ترسیم نقاط غذا 
        function drawFood() {
          ctx.fillStyle = FOOD_COLOUR;
          ctx.strokestyle = FOOD_BORDER_COLOUR;
          ctx.fillRect(foodX, foodY, 10, 10);
          ctx.strokeRect(foodX, foodY, 10, 10);
        }
        //افزایش طول مار با خوردن نقاط غذا
        function advanceSnake() {
          // ایجادیک سر مار جدید 
          const head = {x: snake[0].x + dx, y: snake[0].y + dy};
          // سر جدید را به ابتدای بدن مار اضافه کنید
          snake.unshift(head);
          const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
          if (didEatFood) {
            // افزایش امتیاز
            score += 10;
            // نمایش امتیاز بر روی صفحه نمایش
            document.getElementById('score').innerHTML = score;
            // مکان غذایی جدید ایجاد کنید
            createFood();
          } else {
            // Remove the last part of snake body
            snake.pop();
          }
        }
        //اگر سر مار قسمت دیگری از بازی را لمس کند، درست برمی‌گردد
       // یا هر یک از دیوارها
        function didGameEnd() {
          for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
          }
          const hitLeftWall = snake[0].x < 0;
          const hitRightWall = snake[0].x > gameCanvas.width - 10;
          const hitToptWall = snake[0].y < 0;
          const hitBottomWall = snake[0].y > gameCanvas.height - 10;
          return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
        }
        //ایجاد نقاط غذای مار به صورت تصادفی
        function randomTen(min, max) {
          return Math.round((Math.random() * (max-min) + min) / 10) * 10;
        }
        //ایجاد نقاط غذای مار به صورت تصادفی
        function createFood() {
          
          foodX = randomTen(0, gameCanvas.width - 10);
          
          foodY = randomTen(0, gameCanvas.height - 10);
         //نقطه‌ی غذا روی یکی از نقاط بدن مار نباشد.
          snake.forEach(function isFoodOnSnake(part) {
            const foodIsoNsnake = part.x == foodX && part.y == foodY;
            if (foodIsoNsnake) createFood();
          });
        }

        //مار را روی بوم می کشد
        function drawSnake() {
          // از قسمت های مار حلقه بزنید و هر قسمت را روی بوم بکشید
          snake.forEach(drawSnakePart)
        }
        
         // قسمتی از مار را روی بوم می کشد
       
        function drawSnakePart(snakePart) {
          // رنگ قسمت مار را تنظیم کنید
          ctx.fillStyle = SNAKE_COLOUR;
          // رنگ حاشیه قسمت مار را تنظیم کنید
          ctx.strokestyle = SNAKE_BORDER_COLOUR;
          // یک مستطیل "پر" بکشید تا قسمت مار را در مختصات نشان دهد
          //  قسمت واقع شده است
          ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
          // دور قسمت مار یک حاشیه بکشید
          ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
        }
        //تغییر جهت حرکت مار در پالت کلیدهای جهت کیبورد جاوااسکریپت
        function changeDirection(event) {
          const LEFT_KEY = 37;
          const RIGHT_KEY = 39;
          const UP_KEY = 38;
          const DOWN_KEY = 40;
          
           
          if (changingDirection) return;
          changingDirection = true;
          
          const keyPressed = event.keyCode;
          const goingUp = dy === -10;
          const goingDown = dy === 10;
          const goingRight = dx === 10;
          const goingLeft = dx === -10;
          if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -10;
            dy = 0;
          }
          
          if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -10;
          }
          
          if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 10;
            dy = 0;
          }
          
          if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 10;
          }
        }