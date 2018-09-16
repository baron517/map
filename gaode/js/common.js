/**
 * Created by 867123882 on 2018-9-13.
 */
var serverUrl="http://www.cnvr66.top/crmapp/v1/";



// 可以借助cos a 在0-180之间，单调递减！！！
// 这里用的是叉积，正弦的判断
function multiply(p0,p1,p2){
    return((p1[0]-p0[0])*(p2[1]-p0[1])-(p2[0]-p0[0])*(p1[1]-p0[1]));
}
function distance_no_sqrt(p1,p2)
{
    return((p1[0]-p2[0])*(p1[0]-p2[0])+(p1[1]-p2[1])*(p1[1]-p2[1]));
}
function Graham_scan(pointSet,ch,n){
// 这里会修改pointSet
    var i,j,k=0,top=2;
    var tmp=new Object();
    // 找到一个基点，基本就是保证最下面最左面的点
    for(i=1;i<n;i++){
        if( (pointSet[i][1]<pointSet[k][1]) ||
            ( (pointSet[i][1]==pointSet[k][1]) && (pointSet[i][0]<pointSet[k][0]) )
        ){
            k=i;
        }
    }

    tmp=pointSet[0];
    pointSet[0]=pointSet[k];
    pointSet[k]=tmp;

    use=n;
    for (i=1;i<use-1;i++){
        k=i;
        for (j=i+1;j<use;j++){
            var direct=multiply(pointSet[0],pointSet[k],pointSet[j]);
            if(direct>0){
                k=j;
            }else if(direct==0){
                // k j 同方向
                var dis=distance_no_sqrt(pointSet[0],pointSet[j])-distance_no_sqrt(pointSet[0],pointSet[k]);
                use--; // 也就是不要了
                if(dis>0){
                    // 保留j
                    // 把 k 就不要了
                    pointSet[k]=pointSet[j];
                    pointSet[j]=pointSet[use];
                    j--;
                }else{
                    tmp=pointSet[use];
                    pointSet[use]=pointSet[j];
                    pointSet[j]=tmp;
                }
            }
        }
        tmp=pointSet[i];
        pointSet[i]=pointSet[k];
        pointSet[k]=tmp;
    }

    ch.push(pointSet[0]);
    ch.push(pointSet[1]);
    ch.push(pointSet[2]);
    for (i=3;i<use;i++){
        while ( !(multiply(pointSet[i],ch[top-1],ch[top]) < 0 ) ){
            top--;
            ch.pop();
        }
        top++;
        ch.push(pointSet[i]);
    }

}




// 初始化dpList  两顶点间向量差
function initDPList(pList){

    var dpList=[];
    for(var index=0; index<pList.length; index++){
        dpList.push([pList[index==pList.length-1 ? 0: index+1][0]-pList[index][0],pList[index==pList.length-1 ? 0: index+1][1]-pList[index][1]]);

    }

    return dpList;

}

// 初始化ndpList，单位化两顶点向量差

function initNDPList(dpList){

    var ndpList=[];
    for(var index=0;index<dpList.length; index++)
    {
        var d=Math.sqrt(dpList[index][0]*dpList[index][0]+dpList[index][1]*dpList[index][1]);
        ndpList.push([dpList[index][0]/d,dpList[index][1]/d]);

    }
    return ndpList;
}




// 计算新顶点， 注意参数为负是向内收缩， 为正是向外扩张
function computeLine(dist,ndpList,pList){

    var newList=[];
    var count = pList.length;
    for(var index=0;index<count;index++)
    {
        var point=[];
        var startIndex = index==0 ? count-1 : index-1
        var endIndex   = index;
        var sina =ndpList[startIndex][0]*ndpList[endIndex][1]-ndpList[startIndex][1]*ndpList[endIndex][0];


        var length = dist/sina;
        var vector =[ndpList[endIndex][0] -ndpList[startIndex][0],ndpList[endIndex][1] -ndpList[startIndex][1]];
        var chengfa=[vector[0]*length,vector[1]*length];


        point = [pList[index][0]+ chengfa[0],pList[index][1]+ chengfa[1]];
        newList.push(point);

    }

    return newList;
}







