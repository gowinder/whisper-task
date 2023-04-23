from typing import Union


class ProgressListener:
    def __init__(self):
        pass

    def on_progress(self, current: Union[int, float], total: Union[int, float]):
        self.total = total

    def on_finished(self):
        pass
