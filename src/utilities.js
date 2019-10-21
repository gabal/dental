const utility = {
    timeStringToNumber(time){
        return parseInt(time.split(':').join(''));
    },
    timeStringToPositionNumber(time){
        const array = time.split(':');
        const minutes = parseInt(array[1]);
        const result = parseInt(array[0])*100;
        if(minutes === 30){
            return result+50;
        }else{
            return result;
        }
    }
}

export default utility;