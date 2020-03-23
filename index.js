const aws = require('aws-sdk')
const ec2 = new aws.EC2()

const runModeTagKey = 'RunMode'
const alwaysOnTagValue = 'AlwaysOn'

const getRunningInstances = async _ => {
    const describeInstancesResult = await ec2.describeInstances({
        Filters: [
            {
                Name: 'instance-state-name',
                Values: ['running']
            }
        ]
    }).promise()
    
    return describeInstancesResult.Reservations.map(r => {
        return r.Instances.flat()
    }).flat()
}

const filterOnDemandInstances = instances => {
    return instances.filter(instance => {
        const tags = instance.Tags
        const runModeTag = tags.find(t => t.Key === runModeTagKey)
        
        if (runModeTag) {
            return runModeTag.Value !== alwaysOnTagValue
        } else {
            return true    
        }
    })
}

const stopInstances = async instances => {
    const stopInstancesResult = await ec2.stopInstances({
        InstanceIds: instances.map(i => i.InstanceId)
    }).promise()

    return stopInstancesResult.StoppingInstances.map(i => {
        return i.InstanceId
    }) 
}

exports.handler = async _ => {
    const runningInstances = await getRunningInstances()
    const onDemandInstances = filterOnDemandInstances(runningInstances)
    
    if (onDemandInstances.length === 0) {
        const message = 'No OnDemand instance running.'
        console.log(message)
        return message
    }

    const stoppedInstances = await stopInstances(onDemandInstances)
    
    console.log(stoppedInstances)
    return stoppedInstances
}
