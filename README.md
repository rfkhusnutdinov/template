# Шаблон для проектов на JavaScript

Репозиторий который можно использовать для своих целей по созданию различных JS модулей, пакетов и различных проектов.

> Перед началом работы с шаблоном, в файле `package.json` нужно изменить следующие значения:
>
> - name
> - description
> - author
> - homepage
> - bugs
> - repository
> - keywords
> - main
> - module
> - files

## Описание шаблона

Есть основная папка `src` внутри которой хранится исходный код проекта.

### Стили

Внутри папки `src` есть папка со стилями `styles` которая может в себе хранить как нативные файлы `.css`, так и файлы препроцессора `.scss`. Внутри папки может быть различное кол-во подпапок и внутренних файлов (имена который должны начинаться с символа `_` )

В итоге, файлы которые перечислены в константе `scripts/constants.mjs` `STYLES_FILES` должен быть скомпилированы в папку для продакшн в папку `css`. Все перечисленные файлы, должны находиться в корне папки `src/styles`. В результате компиляции файлы `sass` или `scss` должны конвертироваться в `css` (через пакет **sass**), расставляться префиксы в зависимости от того списка браузеров для которых должна быть поддержка (пакеты **postcss** и **autoprefixer**). Стили должны пройти обработку, убраны все лишние элементы, комментарии, объединены стили и т.д. (например, пакет **cssnano**) В итоге каждый указанный файл должен быть сохранен в папке для продакшн `css` в двух форматах: сжатом `.min.css` и обычном `.css`.

```
src/styles/plugin.scss --> sass --> postcss --> autoprefixer --> cssnano --> [dist/css/plugin.css, dist/css/plugin.min.css]
```

Для линтинга стилей используется `Stylelint` с некоторыми плагинами: `stylelint-config-standard-scss` - конфиг для работы с scss, `stylelint-config-recess-order` - конфиг задает порядок для свойств. Линтинг стилей можно запустить командой. `npm run lint:styles`

Скрипт для сборки стилей прописан в файле `scripts/build-styles.js`.

Запустить данный скрипт для production можно через команду `npm run build:styles`

### Скрипты

Внутри папки `src` есть папка со скриптами `scripts` которая может в себе хранить как нативные файлы `.js` , так и `.mjs`.

Как результат, файлы перечисленные в константе `scripts/contacts.mjs` `SCRIPTS_FILES` должны быть скомпилированы в папку для продакшн в папку `js`. Перечисленные файлы должны находиться в корне `src/scripts`. В формате `UDM` и `ESM`. Файл должен пройти некоторую конвертацию. Сборка скриптов происходит через сборщик `Rollup`.

Сначала скрипт проходит через плагин [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs). Который позволяет конвертировать CommonJS в ES2015 импорты, для возможности их использования в JS через import.

Далее [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) плагин позволяет Rollup найти нужные внешние пакеты.

[@rollup/plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel) Babel — это набор инструментов, который в основном используется для преобразования кода ECMAScript 2015+ в обратно совместимую версию JavaScript в текущих и старых браузерах или средах. Вот основные вещи, которые Babel может сделать для вас:

- Синтаксис преобразования
- Функции полифилла, отсутствующие в вашей целевой среде (через сторонний полифилл, такой как [core-js](https://github.com/zloirock/core-js) )
- Преобразования исходного кода (кодовые модификации)
- И многое другое!

Настройки для Babel прописаны в файле `package.json` в ключе `babel`. Используется базовый пресет `@babel/preset-env`.

Следом идет [@rollup/plugin-terser](https://www.npmjs.com/package/%40rollup/plugin-terser#rollupplugin-terser). Это плагин для Rollup который позволяет минифицировать скрипты.

```
src/scripts/plugin.js --> commonjs --> node-resolve --> babel --> [dist/js/plugin.js, dist/js/plugin.esm.js] --> terser --> dist/js/plugin.min.js
```

Для линтинга скриптов используется ESLint с рекомендуемым базовым конфигом. Линтинг скриптов можно запустить командой `npm run lint:scripts`

Скрипт для сборки скриптов прописан в файле `scripts/build-scripts.js`.

Запустить данный скрипт для production можно через команду `npm run build:scripts`

### Отслеживание изменений в файлах

Для запуска отслеживания изменений в файлах `src/styles` и `src/scripts` используется скрипт `scripts/watch-files.mjs`. Который можно запустить командой `npm run watch`. Для отслеживания файлов используется пакет `chokidar`.
