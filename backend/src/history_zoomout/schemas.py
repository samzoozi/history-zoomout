from pydantic import BaseModel, ConfigDict, Field


class LocationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    historical_name: str | None = Field(
        default=None, serialization_alias="historicalName"
    )
    city: str | None = None
    country: str | None = None
    latitude: float | None = None
    longitude: float | None = None


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
    image_description: str | None = Field(
        default=None, serialization_alias="imageDescription"
    )
    wikidata_id: str | None = Field(default=None, serialization_alias="wikidataId")
    location: LocationOut | None = None


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
    image_description: str | None = Field(
        default=None, serialization_alias="imageDescription"
    )
    wikidata_id: str | None = Field(default=None, serialization_alias="wikidataId")
    events: list[EventOut]
