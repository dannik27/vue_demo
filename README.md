# vue_demo

фичи:
-
- авторизация ( экран авторизации + виджет в шапке)
- отчет по дефектам
- фильтр в списке дефектов
- список схем (цеха/установки)
- добавление фото при создании дефекта
- [works] добавление комментария
- [works] история в карточке дефекта
- довести до ума просмотр схем (двойные клики, выход за границы)
- создание дефекта вместе с компонентом

todo:
-
- preventDefault для событий мыши на схеме, чтобы предотвратить случайное выделение

Поправить: 
  Есть необходимость копировать db.sqlite в папку dist_electron, чтобы электрон её видел
  
Фреймворк:
-
- Добавить прослойку на бекенде для запросов к базе с джойнами. Например, get defect join component.  