type Transfer = {
  worker: Worker
  state: TransferState
}

type TransferState = {
  status: string
  //? A number from 0 - 100 (If NaN,
  //? it will hide ProgressBar)
  progress: number
}
