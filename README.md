# vue_demo

## фичи:

- [works]авторизация ( экран авторизации )
- отчет по дефектам
- [works] фильтр в списке дефектов
- [works] список схем (цеха/установки)
- [works] добавление фото при создании дефекта
- [works] добавление комментария
- [works] история в карточке дефекта
- довести до ума просмотр схем (двойные клики, выход за границы, изменение размера)
- [works] создание дефекта вместе с компонентом
- [works] диалоговое окно выполнения действия
- выбор исполнителя
- [works]отображение фото в карточке дефекта
- [works]нормальное отображение параметров в карточке дефекта
- [works]история дефектов по клику на компонент на схеме

- сортировка в списках
  - [works]список дефектов по убыванию даты

## верстка:

- диалоговое окно добавления комментария
- виджет создания нового компонента
- popup не должен уходить за край экрана

## костыли:

- Есть необходимость копировать db.sqlite в папку dist_electron, чтобы электрон её видел
- responsibleRole в статусе. Нужно как-то определять, кто в данный момент должен работать над дефектом.

## Фреймворк:

- Добавить прослойку на бекенде для запросов к базе с джойнами. Например, get defect join component.
- [in_work] Добавить маршрутизацию между скринами с параметрами (Интенты, миксины...)
- Сохранять положение скроллбара при переходе на другой скрин и восстанавливать при возвращении
