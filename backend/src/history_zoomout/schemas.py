from pydantic import BaseModel, ConfigDict, Field


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    year: int
    sig: str
    title: str
    body: str
    source_url: str | None = Field(default=None, serialization_alias="sourceUrl")
    image_url: str | None = Field(default=None, serialization_alias="imageUrl")
    image_attribution: str | None = Field(
        default=None, serialization_alias="imageAttribution"
    )
    wikidata_id: str | None = Field(default=None, serialization_alias="wikidataId")


class TopicOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    color_index: int = Field(serialization_alias="colorIndex")
    start_year: int = Field(serialization_alias="start")
    end_year: int = Field(serialization_alias="end")
    summary: str | None = Field(default=None)
    source_url: str | None = Field(default=None, serialization_alias="sourceUrl")
    image_url: str | None = Field(default=None, serialization_alias="imageUrl")
    image_attribution: str | None = Field(
        default=None, serialization_alias="imageAttribution"
    )
    wikidata_id: str | None = Field(default=None, serialization_alias="wikidataId")
    events: list[EventOut]
