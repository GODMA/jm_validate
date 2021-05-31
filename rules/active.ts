const categorys = {
    a1: 'string[]',
    b1: 'string[]'
}

const playPlan = {
    playType: 'required|number',
    categorys: JSON.stringify(categorys),
    count: 'number'
}

const taskList = {
    tids: 'string[]',
    iValue: 'number'
}

export const activeRule = {
    activeInfo: {
        actBTitle: 'required|string',
        startTime: 'required|number',
        endTime: 'required|number',
        playPlan: JSON.stringify(playPlan),
        taskList: JSON.stringify(taskList) + '[]',
        ruleDesc: 'string',
        moreids: 'string[]'
    }
}