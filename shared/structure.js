module.exports = {
  defect: {
    fields: [
      {
        name: 'id',
        type: 'string',
        hiden: true
      },
      {
        name: 'externalNumber',
        name_local: 'Идентификатор',
        type: 'string',
        editable: true
      },
      {
        name: 'component',
        name_local: 'Компонент',
        type: 'ref',
        generic: 'component'
      },
      {
        name: 'summary',
        name_local: 'Краткое описание',
        type: 'string',
        editable: true
      },
      {
        name: 'status',
        name_local: 'Статус',
        type: 'ref',
        generic: 'status'
      },
      {
        name: 'discipline',
        name_local: 'Дисциплина',
        type: 'ref',
        generic: 'discipline'
      },
      {
        name: 'category',
        name_local: 'Категория',
        type: 'ref',
        generic: 'category',
        editable: true
      },
      {
        name: 'initiators',
        name_local: 'Инициаторы',
        type: 'array',
        generic: 'person'
      },
      {
        name: 'executor',
        name_local: 'Исполнитель',
        type: 'ref',
        generic: 'person'
      },
      {
        name: 'description',
        name_local: 'Описание',
        type: 'string',
        editable: true
      },
      {
        name: 'expectedWorktime',
        name_local: 'Трудоёмкость',
        type: 'number',
        editable: true
      },
      {
        name: 'estimatedDueDate',
        name_local: 'Дата завершения',
        type: 'timestamp',
        editable: true
      }
    ]
  },

  person: {
    fields: [
      {
        name: 'id',
        type: 'string',
        hiden: true
      },
      {
        name: 'firstname',
        type: 'string'
      },
      {
        name: 'secondname',
        type: 'string'
      },
      {
        name: 'thirdname',
        type: 'string'
      }
    ],
    stringValue: function(person) {
      if (person) {
        return (
          person.secondname +
          ' ' +
          person.firstname.split('')[0] +
          '. ' +
          person.thirdname.split('')[0] +
          '. '
        )
      } else {
        return 'не определено'
      }
    }
  },

  component: {
    fields: [
      {
        name: 'id',
        type: 'string',
        hiden: true
      },
      {
        name: 'tag',
        type: 'string'
      },
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'facility',
        type: 'ref',
        generic: 'facility'
      }
    ],
    stringValue: function(component) {
      return `${component.name} (${component.tag})`
    }
  },

  facility: {
    fields: [
      {
        name: 'id',
        type: 'string',
        hiden: true
      },
      {
        name: 'name',
        type: 'string'
      }
    ]
  },

  category: {
    fields: [
      {
        name: 'id',
        type: 'string',
        hiden: true
      },
      {
        name: 'name',
        type: 'string'
      }
    ],
    isEnum: true,
    stringValue: function(category) {
      return category.name
    }
  },

  status: {
    fields: [
      {
        name: 'id',
        type: 'string',
        hiden: true
      },
      {
        name: 'name',
        type: 'string'
      }
    ],
    stringValue: function(status) {
      return status.name
    }
  },

  discipline: {
    fields: [
      {
        name: 'id',
        type: 'string',
        hiden: true
      },
      {
        name: 'name',
        type: 'string'
      }
    ],
    stringValue: function(discipline) {
      return discipline.name
    }
  }
}
