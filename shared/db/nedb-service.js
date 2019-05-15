var Storage = require('./storage')

module.exports = class NeDBService {
  constructor(foldername) {
    this._storage = new Storage(foldername)
  }

  // Надо ли это вообще
  // getFormData(formName, token, payload){

  //   let user = await nedbService.getUserInfo(token)
  //   if (!user) {
  //     throw new Error("Invalid token")
  //   }

  // }

  async getUserInfo(token) {
    if (!token) {
      return null
    }

    let credentials = await this._storage.getById(
      'credentials',
      parseInt(token)
    )

    if (!credentials) {
      return null
    }
    return this._storage.getById('person', credentials.personId)
  }

  getUserRoleInDefect(user, defect) {
    if (
      defect.contractorId === user.companyId &&
      user.systemRoleIds.includes(3)
    ) {
      return 4
    } else if (defect.executorId === user.id) {
      return 3
    } else if (defect.linearId === user.id) {
      return 2
    } else if (defect.initiatorIds.includes(user.id)) {
      return 1
    } else {
      return -1
    }
  }

  async getHomeFormData(user) {
    user.company = await this._storage.getById('company', user.companyId)

    let defects = await this._storage.getAll('defect')
    let statuses = await this._storage.getAll('status')

    let waitsForMe = defects.filter(defect => {
      let role = this.getUserRoleInDefect(user, defect)
      return (
        statuses.filter(
          status =>
            status.id === defect.statusId && status.responsibleRole === role
        ).length > 0
      )
    })

    for (let defect of waitsForMe) {
      defect.component = await this._storage.getById(
        'component',
        defect.componentId
      )
      defect.initiators = await this._storage.getByIds(
        'person',
        defect.initiatorIds
      )
      defect.category = await this._storage.getById(
        'category',
        defect.categoryId
      )
      defect.discipline = await this._storage.getById(
        'discipline',
        defect.disciplineId
      )
      defect.status = await this._storage.getById('status', defect.statusId)

      defect.userRole = this.getUserRoleInDefect(user, defect)
    }

    defects = defects.sort((a, b) => {
      return a.datetime > b.datetime ? -1 : 1
    })

    return { user, waitsForMe }
  }

  async getDefectListFormData(user) {
    let defects = await this._storage.getAll('defect')

    //todo: сделать асинхронно

    for (let defect of defects) {
      defect.component = await this._storage.getById(
        'component',
        defect.componentId
      )
      defect.initiators = await this._storage.getByIds(
        'person',
        defect.initiatorIds
      )
      defect.category = await this._storage.getById(
        'category',
        defect.categoryId
      )
      defect.discipline = await this._storage.getById(
        'discipline',
        defect.disciplineId
      )
      defect.status = await this._storage.getById('status', defect.statusId)

      // get user role

      let subsystem = await this._storage.getById(
        'subsystem',
        defect.component.subsystemId
      )
      let system = await this._storage.getById('system', subsystem.systemId)

      defect.userRole = this.getUserRoleInDefect(user, defect)

      // TODO: nekrasivo
      // add system

      defect.system = system
    }

    defects = defects.sort((a, b) => {
      return a.datetime > b.datetime ? -1 : 1
    })

    return defects
  }

  async getSearchWidgetFormData(user, payload) {
    let schemaId = parseInt(payload.schemaId)

    let schema = await this._storage.getById('schema', schemaId)
    let marks = await this._storage.getByIds('mark', schema.markIds)

    for (let mark of marks) {
      mark.object = await this._storage.getById(mark.entityName, mark.objectId)
    }

    return marks
  }

  async getSchemaFormData(user, payload) {
    let schemaId = payload.schemaId

    let schema = await this._storage.getById('schema', schemaId)
    schema.image = await this._storage.getById('image', schema.imageId)
    schema.marks = await this._storage.getByIds('mark', schema.markIds)
    schema.subsystems = await this._storage.getByIds(
      'subsystem',
      schema.subsystemIds
    )
    return schema
  }

  async getComponentLinkWidgetFormData(user, payload) {
    let componentId = payload.componentId

    let component = await this._storage.getById('component', componentId)

    let defects = await this._storage.getByQuery('defect', {
      componentId: parseInt(component.id)
    })

    for (let defect of defects) {
      defect.initiators = await this._storage.getByIds(
        'person',
        defect.initiatorIds
      )
      defect.status = await this._storage.getById('status', defect.statusId)
    }

    component.defects = defects

    return component
  }

  async getNewDefectFormData(user, payload) {
    let componentId = parseInt(payload.componentId)

    let component = await this._storage.getById('component', componentId)
    let subsystem = await this._storage.getById(
      'subsystem',
      component.subsystemId
    )
    let system = await this._storage.getById('system', subsystem.systemId)
    let facility = await this._storage.getById('facility', system.facilityId)
    let workshop = await this._storage.getById('workshop', facility.workshopId)
    let linear = await this._storage.getById('person', workshop.linearId)
    let contractor = await this._storage.getById(
      'company',
      facility.contractorId
    )

    let response = {
      component,
      linear,
      contractor,
      facility,
      disciplines: await this._storage.getAll('discipline'),
      categories: await this._storage.getAll('category'),
      user
    }

    return response
  }

  async getDefectCardFormData(user, payload) {
    let defectId = payload.defectId

    let defect = await this._storage.getById('defect', defectId)

    let component = await this._storage.getById('component', defect.componentId)
    let subsystem = await this._storage.getById(
      'subsystem',
      component.subsystemId
    )
    let system = await this._storage.getById('system', subsystem.systemId)
    let facility = await this._storage.getById('facility', system.facilityId)
    let workshop = await this._storage.getById('workshop', facility.workshopId)

    defect.component = component
    defect.facility = facility
    defect.discipline = await this._storage.getById(
      'discipline',
      defect.disciplineId
    )
    defect.category = await this._storage.getById('category', defect.categoryId)
    defect.initiators = await this._storage.getByIds(
      'person',
      defect.initiatorIds
    )
    defect.linear = await this._storage.getById('person', workshop.linearId)
    defect.contractor = await this._storage.getById(
      'company',
      facility.contractorId
    )
    defect.status = await this._storage.getById('status', defect.statusId)
    defect.executor = await this._storage.getById('person', defect.executorId)

    defect.markId = (await this._storage.getByQuery('mark', {
      entityName: 'component',
      objectId: parseInt(component.id)
    }))[0].id
    defect.schemaId = (await this._storage.getByQuery('schema', {
      markIds: { $elemMatch: defect.markId }
    }))[0].id

    if (defect.status.tag === 'APPROVED') {
      let contractorMembersQuery = {
        $and: [
          { systemRoleIds: { $elemMatch: 5 } },
          { companyId: defect.contractor.id }
        ]
      }

      defect.contractor.members = await this._storage.getByQuery(
        'person',
        contractorMembersQuery
      )
    }

    defect.attachments = await this._storage.getByIds(
      'attachment',
      defect.attachmentIds
    )
    for (let attachment of defect.attachments) {
      attachment.person = await this._storage.getById(
        'person',
        attachment.personId
      )
    }

    defect.defectActions = await this._storage.getByIds(
      'defectAction',
      defect.defectActionIds
    )

    for (let action of defect.defectActions) {
      action.defectActionType = await this._storage.getById(
        'defectActionType',
        action.defectActionTypeId
      )
      action.defectActionType.to = await this._storage.getById(
        'status',
        action.defectActionType.to
      )
      action.person = await this._storage.getById('person', action.personId)
    }

    defect.defectComments = await this._storage.getByIds(
      'defectComment',
      defect.defectCommentIds
    )

    for (let comment of defect.defectComments) {
      comment.person = await this._storage.getById('person', comment.personId)
    }

    let userRole = this.getUserRoleInDefect(user, defect)

    let actionsQuery = {
      $and: [{ roles: { $elemMatch: userRole } }, { from: defect.statusId }]
    }

    defect.availableActions = await this._storage.getByQuery(
      'defectActionType',
      actionsQuery
    )

    return defect
  }

  async getPopupFormData(user, payload) {
    let entityName = payload.entityName
    let entityId = parseInt(payload.entityId)

    if (entityName == 'defect') {
      let defect = await this._storage.getById('defect', entityId)
      defect.status = await this._storage.getById('status', defect.statusId)
      defect.initiators = await this._storage.getByIds(
        'person',
        defect.initiatorIds
      )
      return defect
    } else if (entityName == 'schemaComment') {
      let comment = await this._storage.getById('schemaComment', entityId)
      comment.person = await this._storage.getById('person', comment.personId)
      return comment
    } else if (entityName == 'schema') {
      let schema = await this._storage.getById('schema', entityId)
      return schema
    } else {
      return null
    }
  }

  async getReportFormData(user, payload) {
    let response = []

    let defects = await this._storage.getAll('defect')
    let disciplines = await this._storage.getAll('discipline')
    let categories = await this._storage.getAll('category')
    let components = await this._storage.getAll('component')
    let subsystems = await this._storage.getAll('subsystem')
    let systems = await this._storage.getAll('system')
    let statuses = await this._storage.getAll('status')

    for (let defect of defects) {
      let component = components.find(el => el.id == defect.componentId)
      let subsystem = subsystems.find(el => el.id == component.subsystemId)
      let system = systems.find(el => el.id == subsystem.systemId)
      let discipline = disciplines.find(el => el.id == defect.disciplineId)
      let category = categories.find(el => el.id == defect.categoryId)
      let status = statuses.find(el => el.id == defect.statusId)

      let systemRow = response.find(el => el.id == system.id)
      if (!systemRow) {
        systemRow = {
          id: system.id,
          name: system.name,
          disciplines: [],
          values: {
            total: 0,
            actual: 0,
            a: 0,
            b: 0,
            c: 0
          }
        }
        response.push(systemRow)
      }
      let disciplineRow = systemRow.disciplines.find(
        el => el.id == discipline.id
      )
      if (!disciplineRow) {
        disciplineRow = {
          id: discipline.id,
          name: discipline.name,
          total: 0,
          actual: 0,
          a: 0,
          b: 0,
          c: 0
        }
        systemRow.disciplines.push(disciplineRow)
      }

      let isActual = !['CLOSED', 'CONFIRMED'].includes(status.tag)
      let categoryTag
      switch (category.tag) {
        case 'A1':
          categoryTag = 'a'
          break
        case 'B1':
          categoryTag = 'b'
          break
        case 'C1':
          categoryTag = 'c'
          break
      }

      // add defect to report

      disciplineRow.total += 1
      if (isActual) disciplineRow.actual += 1
      disciplineRow[categoryTag] += 1

      systemRow.values.total += 1
      if (isActual) systemRow.values.actual += 1
      systemRow.values[categoryTag] += 1
    }

    Array.prototype.push.apply(response, require('../fake-report'))

    return response
  }

  async postDefect(user, payload) {
    let defect = payload

    for (let [i, attachment] of defect.attachments.entries()) {
      attachment.datetime = defect.datetime + 1 + i
    }

    let attachments = await this._storage.saveAll(
      'attachment',
      defect.attachments
    )

    delete defect.attachments
    defect.attachmentIds = attachments.map(image => image.id)

    let defectActions = [
      {
        datetime: defect.datetime,
        personId: defect.initiatorIds[0],
        defectActionTypeId: 1
      },
      {
        datetime: defect.datetime + 10,
        personId: defect.initiatorIds[0],
        defectActionTypeId: 2
      }
    ]

    defectActions = await this._storage.saveAll('defectAction', defectActions)
    defect.defectActionIds = defectActions.map(da => da.id)

    if (!defect.defectCommentsIds) {
      defect.defectCommentIds = []
    }

    defect.statusId = 2

    return this._storage.save('defect', defect)
  }

  async postDefectAction(user, payload) {
    let action = payload
    action.personId = user.id

    let params = action.parameters
    delete action.parameters

    let defectId = params.defectId

    let defectActionType = await this._storage.getById(
      'defectActionType',
      action.defectActionTypeId
    )

    action = await this._storage.save('defectAction', action)

    let defect = await this._storage.getById('defect', defectId)
    defect.defectActionIds.push(action.id)
    defect.statusId = defectActionType.to

    if (defectActionType.id == 6) {
      defect.executorId = params.contractorMemberId
      defect.estimatedDueDate = params.estimatedDueDate
    }

    return this._storage.save('defect', defect).then(() => {
      return action
    })
  }

  async postDefectComment(user, payload) {
    let comment = payload
    comment.personId = user.id

    let defectId = comment.defectId
    delete comment.defectId

    comment = await this._storage.save('defectComment', comment)

    let defect = await this._storage.getById('defect', defectId)
    defect.defectCommentIds.push(comment.id)

    return this._storage.save('defect', defect).then(() => {
      return comment
    })
  }

  async postMark(user, payload) {
    let mark = payload.mark
    let schemaId = parseInt(payload.schemaId)

    if (mark.object) {
      let object = await this._storage.save(mark.entityName, mark.object)
      mark.objectId = object.id
      delete mark.object
    }

    mark = await this._storage.save('mark', mark)
    let schema = await this._storage.getById('schema', schemaId)
    schema.markIds.push(mark.id)
    return this._storage.save('schema', schema).then(() => {
      return mark
    })
  }
}
