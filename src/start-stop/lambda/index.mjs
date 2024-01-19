import {
    ECSClient,
    ListServicesCommand,
    UpdateServiceCommand
} from '@aws-sdk/client-ecs';
const ecs = new ECSClient();

export const handler = async (event) => {
    console.log('Event', event);
    const desiredCount = event.status == 'start' ? 1 : 0;
    const cluster = event.cluster ?? 'pcc-sdlc-directory-cluster';
    try {
        const command = new ListServicesCommand({
            cluster: cluster,
            maxResults: 50
        });
        const data = await ecs.send(command);
        console.log('Data', data);
        for (const service of data.serviceArns ?? []) {
            await updateService({
                cluster: cluster,
                service: service,
                desiredCount: desiredCount
            });
        }
    } catch (error) {
        console.log('Error', error);
    }
};

async function updateService(params) {
    try {
        const command = new UpdateServiceCommand(params);
        await ecs.send(command);
        console.log(`Updated ${params.service} to ${params.desiredCount} count.`);
    } catch (error) {
        console.log('Error', error);
    }
}