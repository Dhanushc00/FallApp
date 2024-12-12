const rmse = (SVM: number[], Vertical_Acceleration: number[]): number => {
  const mse = SVM.map((val, index) => Math.pow(val - Vertical_Acceleration[index], 2))
                 .reduce((sum, val) => sum + val, 0) / SVM.length;
  return Math.sqrt(mse);
}

interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp : number;
}

interface Angle {
  yaw: number;
  pitch: number;
  roll: number;
}

export const detectFall = (
  acc: SensorData[],
  angle: Angle[],
  thresholdRMSE: number = 0.5,
  thresholdAcc : number = 3.5
): boolean => {

  let svm: number[] = [];
  let vert_acc: number[] = [];

  for (let i = 0; i < acc.length; i++) {
      const { x, y, z } = acc[i];
      const { pitch, roll } = angle[i];
      const svm_val = Math.sqrt(x * x + y * y + z * z);
      svm.push(svm_val);
      const pitchRad = pitch;
      const rollRad = roll;
      const v_acc = Math.abs(x * Math.sin(pitchRad) + y * Math.sin(rollRad) - z * Math.cos(pitchRad) * Math.cos(rollRad));
      vert_acc.push(v_acc);
  }
  const maxAccValue = Math.max(...svm);
  const RMSE = rmse(svm, vert_acc);
  return RMSE < thresholdRMSE && maxAccValue > thresholdAcc;
}