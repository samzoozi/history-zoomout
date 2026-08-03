from pydantic import BaseModel, ConfigDict, Field


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    year: int
    sig: str
    title: str
    body: str


class TopicOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    color_index: int = Field(serialization_alias="colorIndex")
    start_year: int = Field(serialization_alias="start")
    end_year: int = Field(serialization_alias="end")
    events: list[EventOut]
